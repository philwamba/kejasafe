import { Resend } from 'resend'

/**
 * Transport-agnostic mailer with console and Resend drivers.
 */

export interface MailMessage {
    to: string
    subject: string
    html: string
    text?: string
    replyTo?: string
    tags?: Record<string, string>
}

export interface MailerTransport {
    send(message: MailMessage): Promise<{ id: string }>
}

class ConsoleMailer implements MailerTransport {
    async send(message: MailMessage) {
        const divider = '─'.repeat(60)
        const preview = message.text ?? stripHtml(message.html).slice(0, 200)
        console.log(
            `\n${divider}\n[mailer] ${message.subject}\n→ ${message.to}\n${divider}\n${preview}\n${divider}\n`,
        )
        return { id: `console-${Date.now()}` }
    }
}

class ResendMailer implements MailerTransport {
    private readonly resend: Resend
    private readonly from: string

    constructor({
        apiKey,
        from,
    }: {
        apiKey: string
        from: string
    }) {
        this.resend = new Resend(apiKey)
        this.from = from
    }

    async send(message: MailMessage) {
        const { data, error } = await this.resend.emails.send({
            from: this.from,
            to: message.to,
            subject: message.subject,
            html: message.html,
            text: message.text,
            replyTo: message.replyTo,
            tags: message.tags
                ? Object.entries(message.tags).map(([name, value]) => ({
                      name,
                      value,
                  }))
                : undefined,
        })

        if (error) {
            throw new Error(error.message)
        }

        return { id: data?.id ?? `resend-${Date.now()}` }
    }
}

function stripHtml(html: string): string {
    return html
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

let transport: MailerTransport | null = null

export function setMailerTransport(newTransport: MailerTransport) {
    transport = newTransport
}

function defaultTransport(): MailerTransport {
    const provider = process.env.MAIL_PROVIDER?.toLowerCase()
    const apiKey = process.env.RESEND_API_KEY

    if (provider && !['console', 'resend'].includes(provider)) {
        throw new Error(`Unsupported MAIL_PROVIDER "${provider}"`)
    }

    if (provider === 'resend' || (!provider && apiKey)) {
        if (!apiKey) {
            throw new Error('RESEND_API_KEY is required when MAIL_PROVIDER=resend')
        }

        return new ResendMailer({
            apiKey,
            from: formatSender(
                process.env.MAIL_FROM_ADDRESS ?? 'noreply@kejasafe.co.ke',
                process.env.MAIL_FROM_NAME ?? 'Kejasafe',
            ),
        })
    }

    return new ConsoleMailer()
}

function formatSender(address: string, name: string): string {
    const safeName = name.replace(/[\r\n"]/g, '').trim()
    const safeAddress = address.replace(/[\r\n<>]/g, '').trim()

    return safeName ? `${safeName} <${safeAddress}>` : safeAddress
}

export async function sendMail(message: MailMessage) {
    try {
        transport ??= defaultTransport()
        const result = await transport.send(message)
        return { ok: true as const, id: result.id }
    } catch (error) {
        console.error('[mailer] send failed', {
            to: message.to,
            subject: message.subject,
            error: error instanceof Error ? error.message : error,
        })
        return {
            ok: false as const,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

/**
 * Base layout used by all templates.
 */
export function renderEmailLayout({
    title,
    preheader,
    body,
    cta,
}: {
    title: string
    preheader?: string
    body: string
    cta?: { label: string; href: string }
}): string {
    const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ?? 'https://kejasafe.co.ke'
    const safeCtaHref = cta
        ? cta.href.startsWith('http')
            ? cta.href
            : `${appUrl}${cta.href}`
        : null

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escape(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;color:#1c1917;">
  <span style="display:none!important;opacity:0;">${escape(preheader ?? title)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;border:1px solid #e7e5e4;overflow:hidden;">
        <tr>
          <td style="padding:24px 32px;border-bottom:1px solid #f5f5f4;">
            <a href="${appUrl}" style="display:inline-block;color:#fe6a00;font-weight:700;font-size:14px;letter-spacing:0.24em;text-decoration:none;">KEJASAFE</a>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#0c0a09;">${escape(title)}</h1>
            <div style="font-size:15px;line-height:1.65;color:#44403c;">${body}</div>
            ${
                cta && safeCtaHref
                    ? `<div style="margin-top:28px;"><a href="${safeCtaHref}" style="display:inline-block;background:#fe6a00;color:#fff;font-weight:600;font-size:14px;text-decoration:none;padding:12px 22px;border-radius:10px;">${escape(cta.label)}</a></div>`
                    : ''
            }
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background:#fafaf9;border-top:1px solid #f5f5f4;font-size:12px;color:#78716c;">
            Kejasafe · Verified housing for Kenya · <a href="${appUrl}" style="color:#78716c;">kejasafe.co.ke</a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function escape(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

import { renderEmailLayout, sendMail } from '@/lib/core/email/mailer'

interface BaseOwnerInfo {
    fullName: string
    email: string
}

interface BaseListingInfo {
    title: string
    slug: string
}

export async function sendPropertyApprovedEmail({
    owner,
    listing,
    notes,
}: {
    owner: BaseOwnerInfo
    listing: BaseListingInfo
    notes?: string
}) {
    const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ?? 'https://kejasafe.co.ke'

    return sendMail({
        to: owner.email,
        subject: `Your listing "${listing.title}" is live on Kejasafe`,
        html: renderEmailLayout({
            title: 'Your listing is live 🎉',
            preheader: `"${listing.title}" has been approved and is now visible to renters.`,
            body: `
                <p>Hi ${escape(owner.fullName.split(' ')[0])},</p>
                <p>Good news — your listing <strong>${escape(listing.title)}</strong> has been reviewed and approved. It&rsquo;s now live on Kejasafe and visible to thousands of verified renters.</p>
                ${notes ? `<p style="padding:12px 16px;background:#fafaf9;border-radius:8px;font-size:13px;color:#57534e;"><strong>Moderator notes:</strong> ${escape(notes)}</p>` : ''}
                <p>You can monitor inquiries and viewings from your landlord portal.</p>
            `,
            cta: {
                label: 'View your listing',
                href: `${appUrl}/properties/${listing.slug}`,
            },
        }),
    })
}

export async function sendPropertyRejectedEmail({
    owner,
    listing,
    reason,
    notes,
}: {
    owner: BaseOwnerInfo
    listing: BaseListingInfo
    reason: string
    notes?: string
}) {
    const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ?? 'https://kejasafe.co.ke'

    return sendMail({
        to: owner.email,
        subject: `Action needed: "${listing.title}" was not approved`,
        html: renderEmailLayout({
            title: 'We couldn\'t approve your listing yet',
            preheader: `Your listing "${listing.title}" needs changes before it can be published.`,
            body: `
                <p>Hi ${escape(owner.fullName.split(' ')[0])},</p>
                <p>Thanks for submitting <strong>${escape(listing.title)}</strong>. Our moderation team reviewed it and couldn&rsquo;t approve it as-is.</p>
                <div style="margin:18px 0;padding:16px;background:#fff1f2;border:1px solid #ffe4e6;border-radius:10px;">
                    <p style="margin:0;font-size:13px;color:#9f1239;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">Reason</p>
                    <p style="margin:6px 0 0;color:#881337;">${escape(reason)}</p>
                </div>
                ${notes ? `<p style="padding:12px 16px;background:#fafaf9;border-radius:8px;font-size:13px;color:#57534e;"><strong>Moderator notes:</strong> ${escape(notes)}</p>` : ''}
                <p>You can edit your listing in the portal and resubmit it at any time.</p>
            `,
            cta: {
                label: 'Open landlord portal',
                href: `${appUrl}/portal`,
            },
        }),
    })
}

export async function sendUserInvitedEmail({
    user,
    temporaryPassword,
}: {
    user: { fullName: string; email: string }
    temporaryPassword: string
}) {
    const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ?? 'https://kejasafe.co.ke'

    return sendMail({
        to: user.email,
        subject: 'Welcome to Kejasafe — set up your account',
        html: renderEmailLayout({
            title: 'You\'ve been invited to Kejasafe',
            preheader: 'Your admin has created an account for you. Sign in and change your password.',
            body: `
                <p>Hi ${escape(user.fullName.split(' ')[0])},</p>
                <p>An administrator has created a Kejasafe account for you. Use the temporary password below to sign in, then change it immediately under Security.</p>
                <div style="margin:20px 0;padding:16px;background:#fff7ed;border:1px solid #ffedd5;border-radius:10px;">
                    <p style="margin:0;font-size:13px;color:#c2410c;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">Temporary password</p>
                    <p style="margin:6px 0 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:16px;color:#7c2d12;">${escape(temporaryPassword)}</p>
                </div>
                <p style="font-size:13px;color:#78716c;">This password is only valid until you change it. Treat it like any other secret.</p>
            `,
            cta: {
                label: 'Sign in to Kejasafe',
                href: `${appUrl}/login`,
            },
        }),
    })
}

export async function sendReportReceivedEmail({
    reporterEmail,
    listingTitle,
}: {
    reporterEmail: string
    listingTitle: string
}) {
    return sendMail({
        to: reporterEmail,
        subject: 'We received your Kejasafe report',
        html: renderEmailLayout({
            title: 'Thanks for your report',
            preheader: `We've received your report about "${listingTitle}" and our team will review it.`,
            body: `
                <p>Thanks for flagging <strong>${escape(listingTitle)}</strong>. Our moderation team has been notified and will review your report within 24–48 hours.</p>
                <p>You don&rsquo;t need to do anything further — we&rsquo;ll take action on the listing if the report is substantiated. Your contribution helps keep Kejasafe safe for every renter.</p>
            `,
        }),
    })
}

function escape(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

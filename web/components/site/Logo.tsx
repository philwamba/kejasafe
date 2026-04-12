import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

const LOGO_WIDTH = 52
const LOGO_HEIGHT = 70

interface LogoProps {
    href?: string | null
    height?: number
    showWordmark?: boolean
    showBetaBadge?: boolean
    className?: string
    wordmarkClassName?: string
}

export function Logo({
    href = '/',
    height = 36,
    showWordmark = true,
    showBetaBadge = false,
    className,
    wordmarkClassName,
}: LogoProps) {
    const width = Math.round((LOGO_WIDTH / LOGO_HEIGHT) * height)

    const content = (
        <span className={cn('inline-flex items-center gap-2', className)}>
            <Image
                src="/logo.png"
                alt="Kejasafe"
                width={width}
                height={height}
                priority
                style={{ width, height }}
            />
            {showWordmark ? (
                <span className="inline-flex items-start gap-2">
                    <span
                        className={cn(
                            'text-brand text-sm font-semibold tracking-[0.24em]',
                            wordmarkClassName,
                        )}>
                        KEJASAFE
                    </span>
                    {showBetaBadge ? (
                        <span className="border-brand/25 bg-brand/10 text-brand inline-flex h-5 items-center border px-1.5 text-[0.625rem] font-semibold tracking-[0.18em] uppercase">
                            Beta
                        </span>
                    ) : null}
                </span>
            ) : null}
        </span>
    )

    if (!href) {
        return content
    }

    return <Link href={href}>{content}</Link>
}

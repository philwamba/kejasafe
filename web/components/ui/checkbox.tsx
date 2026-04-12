'use client'

import * as React from 'react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import { FiCheck } from 'react-icons/fi'

import { cn } from '@/lib/utils'

function Checkbox({
    className,
    ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(
                'peer text-brand-foreground inline-flex size-5 shrink-0 items-center justify-center rounded-md border border-stone-300 bg-white shadow-sm transition-colors',
                'focus-visible:ring-brand/40 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none',
                'data-[state=checked]:bg-brand data-[state=checked]:border-brand',
                'disabled:cursor-not-allowed disabled:opacity-50',
                className,
            )}
            {...props}>
            <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
                <FiCheck className="size-3.5 stroke-[3]" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
}

export { Checkbox }

'use client'

import type { ReactNode } from 'react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { FiAlertTriangle, FiX } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description?: string
    tone?: 'brand' | 'danger'
    confirmLabel?: string
    cancelLabel?: string
    loading?: boolean
    onConfirm: () => void
    children?: ReactNode
}

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    tone = 'brand',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    loading = false,
    onConfirm,
    children,
}: ConfirmDialogProps) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-sm" />
                <DialogPrimitive.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl">
                    <div className="flex items-start gap-4">
                        <span
                            className={cn(
                                'inline-flex size-11 shrink-0 items-center justify-center rounded-xl',
                                tone === 'danger'
                                    ? 'bg-rose-100 text-rose-600'
                                    : 'bg-brand/10 text-brand',
                            )}>
                            <FiAlertTriangle className="size-5" />
                        </span>
                        <div className="flex-1">
                            <DialogPrimitive.Title className="text-lg font-semibold text-stone-950">
                                {title}
                            </DialogPrimitive.Title>
                            {description ? (
                                <DialogPrimitive.Description className="mt-1 text-sm leading-6 text-stone-600">
                                    {description}
                                </DialogPrimitive.Description>
                            ) : null}
                        </div>
                        <DialogPrimitive.Close
                            aria-label="Close"
                            className="inline-flex size-7 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-100 hover:text-stone-900">
                            <FiX className="size-4" />
                        </DialogPrimitive.Close>
                    </div>

                    {children ? (
                        <div className="mt-5">{children}</div>
                    ) : null}

                    <div className="mt-6 flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            className="h-10 rounded-lg"
                            disabled={loading}
                            onClick={() => onOpenChange(false)}>
                            {cancelLabel}
                        </Button>
                        <Button
                            type="button"
                            size="lg"
                            disabled={loading}
                            onClick={onConfirm}
                            className={cn(
                                'h-10 rounded-lg',
                                tone === 'danger' &&
                                    'bg-rose-600 text-white hover:bg-rose-700',
                            )}>
                            {loading ? 'Working…' : confirmLabel}
                        </Button>
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    )
}

'use client'

import * as React from 'react'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { FiCheck, FiChevronDown, FiSearch, FiX } from 'react-icons/fi'

import { cn } from '@/lib/utils'

export interface ComboboxOption {
    value: string
    label: string
    description?: string
}

interface ComboboxProps {
    options: ComboboxOption[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyState?: string
    disabled?: boolean
    allowClear?: boolean
    className?: string
    id?: string
    name?: string
}

export function Combobox({
    options,
    value,
    onChange,
    placeholder = 'Select…',
    searchPlaceholder = 'Search',
    emptyState = 'No matches',
    disabled = false,
    allowClear = true,
    className,
    id,
    name,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState('')
    const [activeIndex, setActiveIndex] = React.useState(0)
    const listRef = React.useRef<HTMLDivElement>(null)

    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return options
        return options.filter(option =>
            `${option.label} ${option.description ?? ''}`
                .toLowerCase()
                .includes(q),
        )
    }, [options, query])

    React.useEffect(() => {
        if (open) {
            setActiveIndex(0)
        } else {
            setQuery('')
        }
    }, [open])

    React.useEffect(() => {
        if (!open) return
        const el = listRef.current?.querySelector<HTMLElement>(
            `[data-index="${activeIndex}"]`,
        )
        el?.scrollIntoView({ block: 'nearest' })
    }, [activeIndex, open])

    const selected = options.find(option => option.value === value)

    function handleSelect(option: ComboboxOption) {
        onChange(option.value)
        setOpen(false)
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'ArrowDown') {
            event.preventDefault()
            setActiveIndex(prev => Math.min(prev + 1, filtered.length - 1))
        } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            setActiveIndex(prev => Math.max(prev - 1, 0))
        } else if (event.key === 'Enter') {
            event.preventDefault()
            const option = filtered[activeIndex]
            if (option) handleSelect(option)
        } else if (event.key === 'Escape') {
            event.preventDefault()
            setOpen(false)
        }
    }

    return (
        <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
            <PopoverPrimitive.Trigger asChild disabled={disabled}>
                <button
                    id={id}
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    className={cn(
                        'group/combobox flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-stone-200 bg-white px-3 text-left text-sm text-stone-900 outline-none transition',
                        'focus-visible:border-brand focus-visible:ring-brand/30 focus-visible:ring-2',
                        'aria-expanded:border-brand',
                        'disabled:cursor-not-allowed disabled:opacity-60',
                        className,
                    )}>
                    <span
                        className={cn(
                            'truncate',
                            !selected && 'text-stone-400',
                        )}>
                        {selected ? selected.label : placeholder}
                    </span>
                    <span className="flex items-center gap-1.5 text-stone-400">
                        {allowClear && selected && !disabled ? (
                            <span
                                role="button"
                                tabIndex={-1}
                                aria-label="Clear selection"
                                onClick={event => {
                                    event.stopPropagation()
                                    event.preventDefault()
                                    onChange('')
                                }}
                                className="hover:text-brand rounded p-0.5 transition">
                                <FiX className="size-3.5" />
                            </span>
                        ) : null}
                        <FiChevronDown
                            className={cn(
                                'size-4 transition-transform',
                                open && 'rotate-180',
                            )}
                        />
                    </span>
                </button>
            </PopoverPrimitive.Trigger>
            {name ? (
                <input type="hidden" name={name} value={value} />
            ) : null}
            <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                    align="start"
                    sideOffset={6}
                    className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 w-[var(--radix-popover-trigger-width)] min-w-56 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xl">
                    <div className="flex items-center gap-2 border-b border-stone-100 px-3 py-2.5">
                        <FiSearch className="text-brand size-4 shrink-0" />
                        <input
                            autoFocus
                            value={query}
                            onChange={event => {
                                setQuery(event.target.value)
                                setActiveIndex(0)
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={searchPlaceholder}
                            className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
                        />
                    </div>
                    <div
                        ref={listRef}
                        role="listbox"
                        className="max-h-64 overflow-y-auto py-1">
                        {filtered.length === 0 ? (
                            <p className="px-3 py-6 text-center text-xs text-stone-500">
                                {emptyState}
                            </p>
                        ) : (
                            filtered.map((option, index) => {
                                const isSelected = option.value === value
                                const isActive = index === activeIndex
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        role="option"
                                        aria-selected={isSelected}
                                        data-index={index}
                                        onMouseEnter={() =>
                                            setActiveIndex(index)
                                        }
                                        onClick={() => handleSelect(option)}
                                        className={cn(
                                            'flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition',
                                            isActive
                                                ? 'bg-brand/10 text-stone-950'
                                                : 'text-stone-700',
                                        )}>
                                        <div className="min-w-0">
                                            <p className="truncate font-medium">
                                                {option.label}
                                            </p>
                                            {option.description ? (
                                                <p className="truncate text-xs text-stone-500">
                                                    {option.description}
                                                </p>
                                            ) : null}
                                        </div>
                                        {isSelected ? (
                                            <FiCheck className="text-brand size-4 shrink-0" />
                                        ) : null}
                                    </button>
                                )
                            })
                        )}
                    </div>
                </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
    )
}

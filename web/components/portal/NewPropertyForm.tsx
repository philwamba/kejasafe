'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { FiCheckCircle, FiUploadCloud, FiX } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { fetchCsrfToken } from '@/lib/core/sdk/auth-client'

interface Neighborhood {
    slug: string
    name: string
}
interface City {
    slug: string
    name: string
    neighborhoods: Neighborhood[]
}
interface County {
    slug: string
    name: string
    cities: City[]
}
interface PropertyType {
    slug: string
    name: string
}

interface UploadedImage {
    storageKey: string
    url: string
    altText: string
    position: number
    isCover: boolean
}

interface FormValues {
    title: string
    summary: string
    description: string
    propertyTypeSlug: string
    countySlug: string
    citySlug: string
    neighborhoodSlug: string
    listingPurpose: 'rent' | 'sale' | 'short_stay'
    price: number
    deposit?: number
    billingPeriod: 'monthly' | 'weekly' | 'daily' | 'yearly'
    bedrooms?: number
    bathrooms?: number
    furnishingStatus?: 'furnished' | 'semi_furnished' | 'unfurnished' | ''
    petsAllowed: boolean
    parkingSlots?: number
    addressLine1: string
    ownerType: 'landlord' | 'agent' | 'property_manager'
    contactPhone: string
    ownershipDeclared: boolean
    responsibilityAccepted: boolean
}

interface NewPropertyFormProps {
    counties: County[]
    propertyTypes: PropertyType[]
    ownerContactPhone: string
}

const inputClass =
    'h-11 w-full min-w-0 rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-900 outline-none transition focus:border-brand placeholder:text-stone-400'
const labelClass =
    'text-xs font-medium uppercase tracking-[0.14em] text-stone-500'
const errorClass = 'text-xs text-red-600'

export function NewPropertyForm({
    counties,
    propertyTypes,
    ownerContactPhone,
}: NewPropertyFormProps) {
    const router = useRouter()
    const [submitState, setSubmitState] = useState<
        'idle' | 'submitting' | 'submitted'
    >('idle')
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [uploadingCount, setUploadingCount] = useState(0)
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])

    const form = useForm<FormValues>({
        defaultValues: {
            title: '',
            summary: '',
            description: '',
            propertyTypeSlug: '',
            countySlug: '',
            citySlug: '',
            neighborhoodSlug: '',
            listingPurpose: 'rent',
            price: 0,
            deposit: undefined,
            billingPeriod: 'monthly',
            bedrooms: undefined,
            bathrooms: undefined,
            furnishingStatus: '',
            petsAllowed: false,
            parkingSlots: undefined,
            addressLine1: '',
            ownerType: 'landlord',
            contactPhone: ownerContactPhone,
            ownershipDeclared: false,
            responsibilityAccepted: false,
        },
    })

    const countySlug = form.watch('countySlug')
    const citySlug = form.watch('citySlug')

    const cityOptions = useMemo(() => {
        const county = counties.find(c => c.slug === countySlug)
        return county?.cities ?? []
    }, [counties, countySlug])

    const neighborhoodOptions = useMemo(() => {
        const city = cityOptions.find(c => c.slug === citySlug)
        return city?.neighborhoods ?? []
    }, [cityOptions, citySlug])

    async function handleFiles(files: FileList | null) {
        if (!files || files.length === 0) return
        const remaining = 15 - uploadedImages.length
        const filesToUpload = Array.from(files).slice(0, remaining)
        if (filesToUpload.length === 0) return

        setUploadingCount(filesToUpload.length)
        try {
            const csrfToken = await fetchCsrfToken()
            const newOnes: UploadedImage[] = []
            for (const file of filesToUpload) {
                const presignResponse = await fetch(
                    '/api/internal/uploads/presign',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-Token': csrfToken,
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            filename: file.name,
                            contentType: file.type,
                            contentLength: file.size,
                        }),
                    },
                )
                if (!presignResponse.ok) {
                    const body = await presignResponse.json().catch(() => ({}))
                    throw new Error(
                        body?.message ?? 'Could not presign upload.',
                    )
                }
                const { data } = await presignResponse.json()

                const uploadResponse = await fetch(data.uploadUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': file.type },
                    body: file,
                })
                if (!uploadResponse.ok) {
                    throw new Error(
                        `Upload failed for ${file.name} (${uploadResponse.status}).`,
                    )
                }

                newOnes.push({
                    storageKey: data.storageKey,
                    url: data.publicUrl,
                    altText: '',
                    position: uploadedImages.length + newOnes.length,
                    isCover: uploadedImages.length + newOnes.length === 0,
                })
            }
            setUploadedImages(prev => [...prev, ...newOnes])
        } catch (error) {
            setSubmitError(
                error instanceof Error ? error.message : 'Upload failed.',
            )
        } finally {
            setUploadingCount(0)
        }
    }

    function removeImage(index: number) {
        setUploadedImages(prev => {
            const next = prev.filter((_, idx) => idx !== index)
            // Reassign positions; ensure we always have a cover
            return next.map((img, idx) => ({
                ...img,
                position: idx,
                isCover: idx === 0,
            }))
        })
    }

    const onSubmit = form.handleSubmit(async values => {
        setSubmitError(null)
        if (uploadedImages.length === 0) {
            setSubmitError('Please upload at least one image.')
            return
        }
        setSubmitState('submitting')

        try {
            const csrfToken = await fetchCsrfToken()
            const payload = {
                title: values.title,
                summary: values.summary,
                description: values.description,
                propertyTypeSlug: values.propertyTypeSlug,
                countySlug: values.countySlug,
                citySlug: values.citySlug || undefined,
                neighborhoodSlug: values.neighborhoodSlug || undefined,
                listingPurpose: values.listingPurpose,
                price: Number(values.price),
                deposit:
                    values.deposit !== undefined && values.deposit !== null
                        ? Number(values.deposit)
                        : undefined,
                billingPeriod: values.billingPeriod,
                bedrooms: values.bedrooms ? Number(values.bedrooms) : undefined,
                bathrooms: values.bathrooms
                    ? Number(values.bathrooms)
                    : undefined,
                furnishingStatus: values.furnishingStatus || undefined,
                petsAllowed: values.petsAllowed,
                parkingSlots: values.parkingSlots
                    ? Number(values.parkingSlots)
                    : undefined,
                addressLine1: values.addressLine1 || undefined,
                ownerType: values.ownerType,
                contactPhone: values.contactPhone,
                ownershipDeclared: values.ownershipDeclared,
                responsibilityAccepted: values.responsibilityAccepted,
                images: uploadedImages,
            }

            const response = await fetch('/api/internal/properties', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const body = await response.json().catch(() => ({}))
                throw new Error(
                    body?.message ?? 'Submission failed. Please try again.',
                )
            }

            setSubmitState('submitted')
            setTimeout(() => router.push('/portal'), 1500)
        } catch (error) {
            setSubmitError(
                error instanceof Error ? error.message : 'Submission failed.',
            )
            setSubmitState('idle')
        }
    })

    if (submitState === 'submitted') {
        return (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
                <FiCheckCircle className="mx-auto size-12 text-green-600" />
                <h2 className="mt-4 text-2xl font-semibold text-stone-950">
                    Submitted for review
                </h2>
                <p className="mt-2 text-sm text-stone-600">
                    Our team will review your listing within 24–48 hours.
                    You&apos;ll be notified once it goes live.
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={onSubmit} className="grid gap-8">
            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                    Listing Details
                </h2>
                <div className="mt-5 grid gap-4">
                    <label className="grid gap-2">
                        <span className={labelClass}>
                            Title <span className="text-red-600">*</span>
                        </span>
                        <input
                            {...form.register('title', { required: true })}
                            className={inputClass}
                            placeholder="Furnished 2BR in Westlands"
                        />
                    </label>
                    <label className="grid gap-2">
                        <span className={labelClass}>
                            Summary <span className="text-red-600">*</span>
                        </span>
                        <input
                            {...form.register('summary', { required: true })}
                            className={inputClass}
                            placeholder="One line describing the property"
                        />
                    </label>
                    <label className="grid gap-2">
                        <span className={labelClass}>
                            Description <span className="text-red-600">*</span>
                        </span>
                        <textarea
                            {...form.register('description', {
                                required: true,
                            })}
                            rows={6}
                            className="w-full min-w-0 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-brand placeholder:text-stone-400"
                            placeholder="Describe the property, the neighborhood, and what makes it a good rental."
                        />
                    </label>
                    <div className="grid gap-4 md:grid-cols-3">
                        <label className="grid gap-2">
                            <span className={labelClass}>
                                Type <span className="text-red-600">*</span>
                            </span>
                            <select
                                {...form.register('propertyTypeSlug', {
                                    required: true,
                                })}
                                className={inputClass}>
                                <option value="">Choose type…</option>
                                {propertyTypes.map(type => (
                                    <option key={type.slug} value={type.slug}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="grid gap-2">
                            <span className={labelClass}>
                                Listing purpose{' '}
                                <span className="text-red-600">*</span>
                            </span>
                            <select
                                {...form.register('listingPurpose')}
                                className={inputClass}>
                                <option value="rent">Rent</option>
                                <option value="sale">Sale</option>
                                <option value="short_stay">Short stay</option>
                            </select>
                        </label>
                        <label className="grid gap-2">
                            <span className={labelClass}>
                                Owner type{' '}
                                <span className="text-red-600">*</span>
                            </span>
                            <select
                                {...form.register('ownerType')}
                                className={inputClass}>
                                <option value="landlord">Landlord</option>
                                <option value="agent">Agent</option>
                                <option value="property_manager">
                                    Property manager
                                </option>
                            </select>
                        </label>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                    Location
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <label className="grid gap-2">
                        <span className={labelClass}>
                            County <span className="text-red-600">*</span>
                        </span>
                        <select
                            {...form.register('countySlug', {
                                required: true,
                            })}
                            className={inputClass}>
                            <option value="">Choose county…</option>
                            {counties.map(c => (
                                <option key={c.slug} value={c.slug}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="grid gap-2">
                        <span className={labelClass}>City / sub-area</span>
                        <select
                            {...form.register('citySlug')}
                            disabled={cityOptions.length === 0}
                            className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}>
                            <option value="">Choose city…</option>
                            {cityOptions.map(c => (
                                <option key={c.slug} value={c.slug}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="grid gap-2">
                        <span className={labelClass}>Neighborhood</span>
                        <select
                            {...form.register('neighborhoodSlug')}
                            disabled={neighborhoodOptions.length === 0}
                            className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}>
                            <option value="">Choose neighborhood…</option>
                            {neighborhoodOptions.map(n => (
                                <option key={n.slug} value={n.slug}>
                                    {n.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="grid gap-2 md:col-span-3">
                        <span className={labelClass}>
                            Address line (optional)
                        </span>
                        <input
                            {...form.register('addressLine1')}
                            className={inputClass}
                            placeholder="Street / landmark"
                        />
                    </label>
                </div>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                    Pricing and Features
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <label className="grid gap-2">
                        <span className={labelClass}>
                            Price (KES){' '}
                            <span className="text-red-600">*</span>
                        </span>
                        <input
                            type="number"
                            inputMode="numeric"
                            {...form.register('price', {
                                required: true,
                                valueAsNumber: true,
                            })}
                            className={inputClass}
                            placeholder="45000"
                        />
                    </label>
                    <label className="grid gap-2">
                        <span className={labelClass}>Deposit (KES)</span>
                        <input
                            type="number"
                            inputMode="numeric"
                            {...form.register('deposit', {
                                valueAsNumber: true,
                            })}
                            className={inputClass}
                            placeholder="90000"
                        />
                    </label>
                    <label className="grid gap-2">
                        <span className={labelClass}>Billing period</span>
                        <select
                            {...form.register('billingPeriod')}
                            className={inputClass}>
                            <option value="monthly">Monthly</option>
                            <option value="weekly">Weekly</option>
                            <option value="daily">Daily</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </label>
                    <label className="grid gap-2">
                        <span className={labelClass}>Bedrooms</span>
                        <input
                            type="number"
                            min={0}
                            {...form.register('bedrooms', {
                                valueAsNumber: true,
                            })}
                            className={inputClass}
                        />
                    </label>
                    <label className="grid gap-2">
                        <span className={labelClass}>Bathrooms</span>
                        <input
                            type="number"
                            min={0}
                            {...form.register('bathrooms', {
                                valueAsNumber: true,
                            })}
                            className={inputClass}
                        />
                    </label>
                    <label className="grid gap-2">
                        <span className={labelClass}>Parking slots</span>
                        <input
                            type="number"
                            min={0}
                            {...form.register('parkingSlots', {
                                valueAsNumber: true,
                            })}
                            className={inputClass}
                        />
                    </label>
                    <label className="grid gap-2">
                        <span className={labelClass}>Furnishing</span>
                        <select
                            {...form.register('furnishingStatus')}
                            className={inputClass}>
                            <option value="">Unspecified</option>
                            <option value="furnished">Furnished</option>
                            <option value="semi_furnished">Semi-furnished</option>
                            <option value="unfurnished">Unfurnished</option>
                        </select>
                    </label>
                    <label className="flex items-center gap-3 md:col-span-2">
                        <Controller
                            control={form.control}
                            name="petsAllowed"
                            render={({ field }) => (
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={v =>
                                        field.onChange(Boolean(v))
                                    }
                                />
                            )}
                        />
                        <span className="text-sm text-stone-700">
                            Pets allowed
                        </span>
                    </label>
                </div>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                    Photos <span className="text-red-600">*</span>
                </h2>
                <p className="mt-1 text-sm text-stone-600">
                    Upload real photos of this specific property. The first
                    image becomes the cover. Max 15 images, up to 10 MB each.
                </p>
                <label className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 p-8 transition hover:border-brand hover:bg-brand/5">
                    <FiUploadCloud className="text-brand size-8" />
                    <span className="text-sm font-medium text-stone-700">
                        {uploadingCount > 0
                            ? `Uploading ${uploadingCount}…`
                            : 'Click or drop photos here'}
                    </span>
                    <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        className="hidden"
                        onChange={e => handleFiles(e.target.files)}
                    />
                </label>
                {uploadedImages.length > 0 ? (
                    <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                        {uploadedImages.map((image, index) => (
                            <li key={image.storageKey} className="relative">
                                <div
                                    className="aspect-4/3 w-full rounded-xl border border-stone-200 bg-stone-100 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${image.url})`,
                                    }}
                                />
                                {image.isCover ? (
                                    <span className="bg-brand absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white">
                                        Cover
                                    </span>
                                ) : null}
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute right-2 top-2 inline-flex size-6 items-center justify-center rounded-full bg-stone-900/80 text-white transition hover:bg-stone-900">
                                    <FiX className="size-3" />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : null}
            </section>

            <section
                id="owner-instructions"
                className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                    Owner Instructions
                </h2>
                <p className="mt-2 text-sm text-stone-600">
                    Please confirm you&apos;ve read and agree to Kejasafe&apos;s
                    listing guidelines before submitting.
                </p>
                <ul className="mt-4 grid gap-2 text-sm leading-6 text-stone-700">
                    <li>
                        • You are the owner or have legal authority to list
                        this property.
                    </li>
                    <li>• All information is truthful and accurate.</li>
                    <li>• Images are real photos of this actual property.</li>
                    <li>
                        • KejaSafe may contact you to verify details before
                        approval.
                    </li>
                    <li>
                        • Submissions are reviewed within 24–48 hours and
                        rejected if inaccurate or misleading.
                    </li>
                </ul>
                <div className="mt-6 grid gap-4">
                    <label className="flex items-start gap-3">
                        <Controller
                            control={form.control}
                            name="ownershipDeclared"
                            render={({ field }) => (
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={v =>
                                        field.onChange(Boolean(v))
                                    }
                                />
                            )}
                        />
                        <span className="text-sm leading-6 text-stone-700">
                            I confirm I am the property owner or have legal
                            authority to list this property.{' '}
                            <span className="text-red-600">*</span>
                        </span>
                    </label>
                    <label className="flex items-start gap-3">
                        <Controller
                            control={form.control}
                            name="responsibilityAccepted"
                            render={({ field }) => (
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={v =>
                                        field.onChange(Boolean(v))
                                    }
                                />
                            )}
                        />
                        <span className="text-sm leading-6 text-stone-700">
                            I accept responsibility for the accuracy of this
                            listing and understand KejaSafe may edit or reject
                            it.{' '}
                            <span className="text-red-600">*</span>
                        </span>
                    </label>
                    <label className="grid gap-2">
                        <span className={labelClass}>
                            Contact phone{' '}
                            <span className="text-red-600">*</span>
                        </span>
                        <input
                            type="tel"
                            {...form.register('contactPhone', {
                                required: true,
                            })}
                            className={inputClass}
                            placeholder="+254 700 000 000"
                        />
                    </label>
                </div>
            </section>

            {submitError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {submitError}
                </div>
            ) : null}

            <div className="flex items-center justify-end gap-3">
                <Button
                    type="submit"
                    size="lg"
                    disabled={
                        submitState === 'submitting' || uploadingCount > 0
                    }
                    className="h-12 rounded-xl px-8">
                    {submitState === 'submitting'
                        ? 'Submitting…'
                        : 'Submit for review'}
                </Button>
            </div>

            <p className={errorClass + ' hidden'}></p>
        </form>
    )
}

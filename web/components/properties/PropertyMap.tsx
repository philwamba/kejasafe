'use client'

import { useEffect, useRef } from 'react'

import 'leaflet/dist/leaflet.css'

interface PropertyMapProps {
    latitude: number
    longitude: number
    title: string
    addressLabel?: string
}

export function PropertyMap({
    latitude,
    longitude,
    title,
    addressLabel,
}: PropertyMapProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return
        if (typeof window === 'undefined') return

        let map: import('leaflet').Map | null = null
        let cancelled = false

        import('leaflet').then(leafletModule => {
            if (cancelled || !containerRef.current) return
            const L = leafletModule.default

            map = L.map(containerRef.current, {
                center: [latitude, longitude],
                zoom: 15,
                zoomControl: true,
                scrollWheelZoom: false,
                attributionControl: true,
            })

            L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
                {
                    subdomains: 'abcd',
                    maxZoom: 20,
                    attribution:
                        '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
                },
            ).addTo(map)

            const tilePane =
                map.getContainer().querySelector<HTMLElement>('.leaflet-tile-pane')
            if (tilePane) {
                tilePane.style.filter =
                    'hue-rotate(330deg) saturate(1.15) brightness(0.98) contrast(1.02)'
            }

            const logoIcon = L.icon({
                iconUrl: '/logo.png',
                iconSize: [52, 70],
                iconAnchor: [26, 68],
                popupAnchor: [0, -60],
                className: 'kejasafe-map-pin',
            })

            const marker = L.marker([latitude, longitude], { icon: logoIcon })
            marker.addTo(map)

            if (addressLabel) {
                marker
                    .bindPopup(
                        `<div style="font-family: inherit; font-size: 13px; color: #1c1917; font-weight: 600;">${escapeHtml(
                            title,
                        )}</div><div style="font-family: inherit; font-size: 12px; color: #78716c; margin-top: 2px;">${escapeHtml(
                            addressLabel,
                        )}</div>`,
                    )
                    .openPopup()
            }
        })

        return () => {
            cancelled = true
            if (map) {
                map.remove()
                map = null
            }
        }
    }, [latitude, longitude, title, addressLabel])

    return (
        <div className="overflow-hidden rounded-2xl border border-stone-200 shadow-sm">
            <div
                ref={containerRef}
                className="h-[360px] w-full"
                aria-label={`Map showing location of ${title}`}
            />
        </div>
    )
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

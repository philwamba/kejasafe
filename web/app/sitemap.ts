import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import type { MetadataRoute } from 'next'

import { blogPosts, legalPages } from '@/modules/cms/content'
import { slugify } from '@/modules/locations/content'

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://kejasafe.co.ke'

interface CountyEntry {
    name: string
    cities: Array<{ name: string }>
}

function loadCatalog(): { counties: CountyEntry[] } {
    try {
        const path = resolve(process.cwd(), '../data/locations/kenya.json')
        return JSON.parse(readFileSync(path, 'utf-8'))
    } catch {
        return { counties: [] }
    }
}

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes = [
        '',
        '/about',
        '/contact',
        '/faq',
        '/pricing',
        '/properties',
        '/search',
        '/blog',
        '/locations',
    ].map(path => ({
        url: `${appUrl}${path}`,
        lastModified: new Date(),
    }))

    const legalRoutes = Object.keys(legalPages).map(slug => ({
        url: `${appUrl}/legal/${slug}`,
        lastModified: new Date(),
    }))

    const blogRoutes = blogPosts.map(post => ({
        url: `${appUrl}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt),
    }))

    const catalog = loadCatalog()
    const countyRoutes = catalog.counties.map(county => ({
        url: `${appUrl}/locations/${slugify(county.name)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    const cityRoutes = catalog.counties.flatMap(county =>
        county.cities.map(city => ({
            url: `${appUrl}/locations/${slugify(county.name)}/${slugify(city.name)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        })),
    )

    return [
        ...staticRoutes,
        ...legalRoutes,
        ...blogRoutes,
        ...countyRoutes,
        ...cityRoutes,
    ]
}

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { PropertySearchBarClient } from '@/components/properties/PropertySearchBarClient'
import { slugify } from '@/modules/locations/content'

interface CountyEntry {
    name: string
    cities: Array<{ name: string }>
}

function loadCatalog(): CountyEntry[] {
    try {
        const path = resolve(process.cwd(), '../data/locations/kenya.json')
        const parsed = JSON.parse(readFileSync(path, 'utf-8'))
        return parsed.counties as CountyEntry[]
    } catch {
        return []
    }
}

export function PropertySearchBar() {
    const counties = loadCatalog().map(county => ({
        slug: slugify(county.name),
        name: county.name,
        cities: county.cities.map(city => ({
            slug: slugify(city.name),
            name: city.name,
        })),
    }))

    return <PropertySearchBarClient counties={counties} />
}

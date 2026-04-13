/**
 * Location content module.
 *
 * Structured facts + optional flagship articles for every Kenyan county.
 * Used by /locations pages. Safety language is strictly qualitative.
 */

export type Region =
    | 'Nairobi Metropolitan'
    | 'Coastal'
    | 'Central'
    | 'Rift Valley'
    | 'Western'
    | 'Nyanza'
    | 'Eastern'
    | 'Northern'

export type PriceBand = 'budget' | 'mid' | 'premium' | 'luxury' | 'mixed'

export interface LocationFacts {
    slug: string
    name: string
    region: Region
    tagline: string
    priceBand: PriceBand
    commonTypes: string[]
    bestFor: string[]
    highlights: string[]
    whatToKnow: string[]
    keywords: string[]
}

export interface LocationContent extends LocationFacts {
    description: string
    housingSnapshotText: string
    hasFlagshipContent: boolean
}

/**
 * Raw facts for each county. Flagship counties have richer entries.
 * Non-flagship counties get content generated from facts by `generateContent`.
 */
const COUNTY_FACTS: Record<
    string,
    LocationFacts & { flagship?: boolean; flagshipDescription?: string }
> = {
    nairobi: {
        slug: 'nairobi',
        name: 'Nairobi',
        region: 'Nairobi Metropolitan',
        tagline: "Kenya's capital and commercial hub",
        priceBand: 'mixed',
        commonTypes: [
            'Apartments',
            'Bedsitters',
            'Townhouses',
            'Standalone houses',
        ],
        bestFor: [
            'Working professionals',
            'Expats',
            'Families with school-age children',
            'Students near universities',
        ],
        highlights: [
            'Largest rental market in East Africa',
            'Established upmarket suburbs in Westlands, Kilimani, Karen and Runda',
            'Affordable bedsitter and studio belts in Kasarani, Embakasi and Kibera-adjacent areas',
            'Strong fibre and backup-power coverage in most tier-1 estates',
        ],
        whatToKnow: [
            'Peak-hour traffic shapes commute times — pick location relative to where you work.',
            'Water supply is borehole-supplemented in many estates; ask before signing.',
            'Upmarket areas typically have gated access, private security and CCTV as standard.',
            'Expect to pay 1-2 months rent as deposit plus one month in advance.',
        ],
        keywords: [
            'houses for rent in Nairobi',
            'Nairobi apartments',
            'bedsitter Nairobi',
            'Westlands apartments',
            'Kilimani houses',
        ],
        flagship: true,
        flagshipDescription:
            "Nairobi concentrates the bulk of Kenya's formal rental market and hosts almost every rental pattern on the continent — from KES 6,000 bedsitters in Kasarani to KES 800,000 villas in Runda. The city splits roughly into four housing belts: the upmarket leafy suburbs (Runda, Karen, Muthaiga, Kitisuru), the high-density urban cores (Kilimani, Westlands, Lavington, Parklands) that mix apartments with nightlife and offices, the middle-income estates along Thika Road and the Eastern Bypass (Kasarani, Ruiru, Roysambu), and the budget belts (Embakasi, Umoja, Kayole) that house the majority of workers commuting to the CBD. Choosing where to live in Nairobi is really a question about commute tolerance: a 10 km move can add 90 minutes each way at peak. Established estates across all price bands have gated access, private security and generator backup as standard, and fibre internet is near-ubiquitous in tier-1 and tier-2 areas.",
    },
    mombasa: {
        slug: 'mombasa',
        name: 'Mombasa',
        region: 'Coastal',
        tagline: "Kenya's second city and the country's largest port",
        priceBand: 'mid',
        commonTypes: ['Apartments', 'Standalone houses', 'Beach villas'],
        bestFor: [
            'Port and logistics professionals',
            'Retirees seeking coastal living',
            'Remote workers',
            'Short-stay and holiday renters',
        ],
        highlights: [
            'Beachfront premium stock in Nyali, Bamburi and Shanzu',
            'Established mid-market in Tudor, Kizingo and Kiembeni',
            'Short-stay and holiday lets dominate the north coast',
            'Warm humid climate year-round',
        ],
        whatToKnow: [
            'Salt air and humidity mean you should confirm recent maintenance on exposed fittings.',
            'Water pressure varies — check during a viewing.',
            'Fibre is standard in upmarket areas; spotty in older buildings.',
            'Compound security is near-universal at mid and premium levels.',
        ],
        keywords: [
            'houses for rent Mombasa',
            'Nyali apartments',
            'Bamburi houses',
            'Mombasa beach villa',
        ],
        flagship: true,
        flagshipDescription:
            "Mombasa's rental market revolves around two geographies: the north coast (Nyali, Bamburi, Shanzu, Mtwapa), where newer apartment blocks and beach villas cater to expats, retirees and short-stay holiday renters; and the island itself (Tudor, Kizingo, Old Town, Kiembeni), which holds Mombasa's older but more central residential stock. North coast properties command a premium — KES 45,000 and up for a serviced one-bedroom — and come with pool, gym and sea-access amenities. The island offers better value for families and professionals tied to downtown. Salt air and humidity are the genuine unknowns in Mombasa rentals: always confirm when fittings and AC units were last serviced, and check water pressure during the viewing. Fibre is reliable in the upper tier and inconsistent in older buildings.",
    },
    kiambu: {
        slug: 'kiambu',
        name: 'Kiambu',
        region: 'Nairobi Metropolitan',
        tagline: 'Nairobi commuter belt with newer housing stock',
        priceBand: 'mid',
        commonTypes: ['Apartments', 'Townhouses', 'Gated estates'],
        bestFor: [
            'Young families priced out of Nairobi core',
            'Civil servants',
            'Work-from-home professionals',
        ],
        highlights: [
            'Explosion of new apartment stock along Thika Road and Eastern Bypass',
            'Gated estates in Ruiru, Juja, Kikuyu and Kiambu Town',
            'Cooler climate than central Nairobi',
            'Better value per square metre than Westlands or Kilimani',
        ],
        whatToKnow: [
            'Commute to Nairobi CBD depends entirely on which side of the bypass you pick.',
            'Water supply can be intermittent in some parts of Ruiru and Juja — confirm tank capacity.',
            'Estates have become a main driver of Nairobi metro growth; stock is mostly newer than 2018.',
            'Council rates and service charges vary widely between estates.',
        ],
        keywords: [
            'houses for rent Kiambu',
            'Ruiru apartments',
            'Juja apartments',
            'Kikuyu houses',
            'Thika Road houses',
        ],
        flagship: true,
        flagshipDescription:
            'Kiambu County has become the go-to Nairobi commuter belt, driven by newer apartment stock and gated estates at a meaningful discount to Nairobi core. The county splits into three housing submarkets: Ruiru and Juja along Thika Road, which hold the highest concentration of gated mid-market estates; Kikuyu, Banana and Kabete to the west, which skew towards family-sized houses; and Kiambu Town itself, which mixes older establishment housing with newer apartments. Most of the apartment stock across Kiambu was built after 2018 and comes with standards Nairobi core residents pay a premium for: lifts, backup generators, gated compounds, dedicated parking. The trade-off is commute: if you work in Westlands or Upperhill, your Kiambu address needs to sit on your side of the bypass — otherwise Thika Road traffic will eat 90 minutes each way.',
    },
    nakuru: {
        slug: 'nakuru',
        name: 'Nakuru',
        region: 'Rift Valley',
        tagline: 'Rift Valley hub with growing suburban stock',
        priceBand: 'mid',
        commonTypes: ['Apartments', 'Bungalows', 'Gated estates'],
        bestFor: [
            'Families',
            'Government employees',
            'Civil society professionals',
        ],
        highlights: [
            'City status unlocked steady rental demand',
            'Naivasha sub-market serves tourism and geothermal sectors',
            'Lower cost of living than Nairobi',
            'Strong school and hospital network',
        ],
        whatToKnow: [
            'Nakuru Town and Naivasha are very different markets — pick accordingly.',
            'Water supply is generally good but ask about storage.',
            'Commercial listings trend towards CBD-adjacent roads.',
        ],
        keywords: [
            'houses for rent Nakuru',
            'Nakuru apartments',
            'Naivasha houses',
            'Rift Valley rentals',
        ],
        flagship: true,
        flagshipDescription:
            "Nakuru's rental market split cleanly in 2021 when Nakuru Town was upgraded to city status. Nakuru Town itself has a growing supply of modern apartments in Section 58, Milimani and Kiamunyi, catering mostly to civil servants, teachers and professionals at the regional offices of national agencies. Naivasha is a distinct market driven by tourism (around Lake Naivasha), geothermal operations (Olkaria, Eburru) and flower farms — expect a mix of farm staff housing, short-stay units aimed at Nairobi weekenders, and mid-market apartments aimed at professionals at KenGen and the flower firms. For a family move to Nakuru, Section 58 and Milimani are the reference points; for a Naivasha move, La Belle Inn area and Karagita are the main anchors.",
    },
    kisumu: {
        slug: 'kisumu',
        name: 'Kisumu',
        region: 'Nyanza',
        tagline: "Kenya's third city on the shores of Lake Victoria",
        priceBand: 'mid',
        commonTypes: ['Apartments', 'Bungalows', 'Lakeside villas'],
        bestFor: [
            'NGO and UN professionals',
            'Academic staff at JOOUST and Maseno',
            'Remote workers on a budget',
        ],
        highlights: [
            'Milimani remains the reference upmarket area',
            'Lakeshore pockets near Impala Park and Dunga',
            'Lower cost base than Nairobi or Mombasa',
            'Concentration of NGOs and research institutions',
        ],
        whatToKnow: [
            'Most premium stock concentrates in Milimani and Riat.',
            'Mosquito control is worth asking about in lakeside units.',
            'Internet quality varies sharply block by block.',
        ],
        keywords: [
            'houses for rent Kisumu',
            'Milimani apartments',
            'Kisumu houses',
            'Lake Victoria rentals',
        ],
        flagship: true,
        flagshipDescription:
            'Kisumu is the most rentable city in Nyanza, with most demand driven by NGOs, research institutions, academic staff and national agencies. Milimani is the reference upmarket area — newer apartment blocks, gated compounds, generators as standard. Riat Hills offers newer family-sized houses. For a budget-friendly option, Mamboleo and Nyamasaria hold modest apartments at meaningfully lower rents. Lakeshore pockets around Impala Park and Dunga offer the most characterful stock but come with mosquito and humidity trade-offs; confirm screens, nets and treatment during your viewing. Fibre internet reaches the main residential roads but drops off quickly in informal areas.',
    },
    'uasin-gishu': {
        slug: 'uasin-gishu',
        name: 'Uasin Gishu',
        region: 'Rift Valley',
        tagline: "Home of Eldoret — Kenya's running capital",
        priceBand: 'mid',
        commonTypes: ['Apartments', 'Bungalows', 'Gated estates'],
        bestFor: [
            'Athletes and training camps',
            'Moi University staff',
            'Agricultural professionals',
        ],
        highlights: [
            'Eldoret is the regional hub for western Kenya',
            'Elgon View is the reference upmarket suburb',
            'Strong concentration of high-altitude training facilities',
        ],
        whatToKnow: [
            'Cool climate year-round — heating not needed but proper insulation helps.',
            'Some newer estates have borehole-only water.',
        ],
        keywords: [
            'houses for rent Eldoret',
            'Uasin Gishu rentals',
            'Elgon View',
        ],
        flagship: true,
        flagshipDescription:
            "Uasin Gishu's rental market centres on Eldoret, the regional hub for western Kenya. Elgon View is the established upmarket area with standalone houses and newer townhouses. Pioneer, Kapsoya and West Indies cover the mid-market with apartments and gated bungalow estates. The climate is cool year-round (1,900m altitude) so heating isn't needed — but insulation quality varies wildly, so visit during the late afternoon if you can. A distinct market exists around Iten in Elgeyo Marakwet, 30 km away, driven by the high-altitude running camps: short-stay and long-lease options both exist for athletes on training cycles.",
    },
    machakos: {
        slug: 'machakos',
        name: 'Machakos',
        region: 'Nairobi Metropolitan',
        tagline: 'Eastern Nairobi commuter belt with affordable new stock',
        priceBand: 'budget',
        commonTypes: ['Apartments', 'Bungalows', 'Gated estates'],
        bestFor: [
            'Families priced out of Nairobi core',
            'Retirees on a pension',
            'Working professionals with flexible commute',
        ],
        highlights: [
            'Athi River and Mlolongo are the closest sub-markets to Nairobi',
            'Syokimau hosts the majority of new apartment stock',
            'Kitengela straddles the Machakos / Kajiado border — check which side your listing is on',
            'Lower council rates than Nairobi',
        ],
        whatToKnow: [
            'Water is the #1 local issue — confirm tank capacity and borehole access.',
            'Southern Bypass use shapes your commute experience; SGR station is in Syokimau for Mombasa trips.',
        ],
        keywords: [
            'Syokimau apartments',
            'Athi River houses',
            'Mlolongo rentals',
            'Machakos rentals',
        ],
        flagship: true,
        flagshipDescription:
            'Machakos County serves as the eastern commuter belt for Nairobi, with Syokimau, Athi River and Mlolongo forming the most active rental submarkets. Syokimau alone has hundreds of apartment units built after 2019, catering mostly to families priced out of Nairobi core who still need a sub-45-minute commute. Athi River and Mlolongo hold more mixed stock — older bungalows, newer townhouses and a growing gated-estate segment. Kitengela sits right on the boundary between Machakos and Kajiado and is often listed under either; confirm which side your specific listing is on for water and rates. Water supply is the single biggest local issue — ask every listing about tank capacity, borehole access and typical delivery frequency during the viewing.',
    },
    kajiado: {
        slug: 'kajiado',
        name: 'Kajiado',
        region: 'Nairobi Metropolitan',
        tagline: 'South Nairobi expansion: Ongata Rongai, Ngong and Kitengela',
        priceBand: 'mid',
        commonTypes: ['Apartments', 'Townhouses', 'Standalone houses'],
        bestFor: [
            'Young families',
            'Working professionals',
            'Middle-income earners',
        ],
        highlights: [
            'Ongata Rongai holds high-density apartment stock',
            'Ngong Hills views and cooler climate',
            'Kitengela is the southern entry to Nairobi',
            'Kajiado Town serves regional administration',
        ],
        whatToKnow: [
            "Rongai-to-CBD commute via Lang'ata Road is the bottleneck.",
            'Water supply is a consistent topic in Ngong and Kiserian.',
        ],
        keywords: [
            'Ongata Rongai apartments',
            'Kitengela houses',
            'Ngong apartments',
            'Kajiado rentals',
        ],
        flagship: true,
        flagshipDescription:
            "Kajiado's rental market sits almost entirely on Nairobi's southern edge. Ongata Rongai holds the highest concentration of apartment stock, with most units built in the last six years and aimed at young families and working professionals. Ngong offers cooler climate, Ngong Hills views and a mix of townhouses and standalone houses; water supply is a consistent topic here, so always confirm. Kitengela is the southern entry to Nairobi and holds a mix of apartments aimed at Athi River industrial workers and newer gated estates. Kajiado Town itself has a smaller rental market dominated by civil servant housing. Rongai's commute to CBD is bottlenecked by Lang'ata Road — if you're moving for work in Westlands or Upperhill, factor 60-90 minutes peak.",
    },
    kilifi: {
        slug: 'kilifi',
        name: 'Kilifi',
        region: 'Coastal',
        tagline: 'North coast expansion from Kilifi Town to Watamu and Malindi',
        priceBand: 'mid',
        commonTypes: ['Villas', 'Apartments', 'Short-stay cottages'],
        bestFor: [
            'Retirees and expats',
            'Remote workers',
            'Short-stay and holiday tenants',
            'Digital nomads',
        ],
        highlights: [
            'Kilifi Creek villa market',
            'Watamu is an international holiday hub',
            'Malindi has a large Italian expat community',
            'Short-stay and long-lease markets both active',
        ],
        whatToKnow: [
            'Many villas are owner-absentee — confirm a local caretaker is in place.',
            'Humidity and salt air demand well-maintained properties.',
        ],
        keywords: [
            'houses for rent Kilifi',
            'Watamu villas',
            'Malindi apartments',
            'Kilifi Creek',
        ],
        flagship: true,
        flagshipDescription:
            "Kilifi is Kenya's most internationalised coastal rental market after Mombasa, anchored by three distinct submarkets: Kilifi Town and Kilifi Creek, home to a growing villa and serviced-apartment segment aimed at remote workers and expat retirees; Watamu, where short-stay and holiday rentals dominate around Turtle Bay and Mida Creek; and Malindi, which retains a large Italian community and mixes old-town apartments with beachfront villas. Expect a high proportion of owner-absentee listings — always confirm a local caretaker or property manager is in place before signing. Humidity and salt air are non-negotiable Kilifi constraints: recent maintenance is the single most important thing to verify during a viewing, especially on AC units, timber fittings and metalwork.",
    },
    kisii: {
        slug: 'kisii',
        name: 'Kisii',
        region: 'Nyanza',
        tagline: 'Commercial hub for south-western Kenya',
        priceBand: 'budget',
        commonTypes: ['Apartments', 'Bungalows'],
        bestFor: [
            'Professionals at regional offices',
            'Students at Kisii University',
            'Civil servants',
        ],
        highlights: [
            'Strong commercial activity',
            'Good school and hospital network',
            'Lower rents than Nairobi or Kisumu',
        ],
        whatToKnow: [
            'Rainy season affects road quality in outer estates.',
            'Newer apartment stock is concentrated along Daraja Mbili–Nyanchwa road.',
        ],
        keywords: [
            'houses for rent Kisii',
            'Kisii Town apartments',
            'Kisii University rentals',
        ],
        flagship: true,
        flagshipDescription:
            'Kisii Town is the commercial and administrative anchor for south-western Kenya, and its rental market is driven by civil servants, professionals at regional offices (KRA, TSC, Ministry of Health) and Kisii University staff and students. Most newer apartment stock sits along the Daraja Mbili–Nyanchwa corridor, where mid-market two- and three-bedroom units are available at a meaningful discount to equivalent space in Nairobi. Rains are more frequent here than in central Nairobi, so ask about drainage and road access in the outer estates. Kisii sits at altitude and the climate is cool year-round — pleasant for living but an important consideration for how buildings are insulated.',
    },
}

function defaultFacts(slug: string, name: string): LocationFacts {
    return {
        slug,
        name,
        region: 'Central',
        tagline: `Properties for rent and sale in ${name}, Kenya`,
        priceBand: 'mixed',
        commonTypes: ['Apartments', 'Bungalows', 'Standalone houses'],
        bestFor: ['Working professionals', 'Families', 'Civil servants'],
        highlights: [
            `Regional rental market across ${name}`,
            'Mix of older establishment stock and newer developments',
            'Lower cost base than Nairobi',
        ],
        whatToKnow: [
            'Confirm water supply arrangements before signing.',
            'Ask about internet and mobile coverage for your specific estate.',
            'Request details on security and access control.',
        ],
        keywords: [
            `houses for rent ${name}`,
            `${name} apartments`,
            `${name} property`,
        ],
    }
}

// Map county slug to region based on the Kenya catalog.
const REGION_BY_COUNTY: Record<string, Region> = {
    nairobi: 'Nairobi Metropolitan',
    kiambu: 'Nairobi Metropolitan',
    kajiado: 'Nairobi Metropolitan',
    machakos: 'Nairobi Metropolitan',
    mombasa: 'Coastal',
    kwale: 'Coastal',
    kilifi: 'Coastal',
    'tana-river': 'Coastal',
    lamu: 'Coastal',
    'taita-taveta': 'Coastal',
    nyeri: 'Central',
    kirinyaga: 'Central',
    'murang-a': 'Central',
    'tharaka-nithi': 'Central',
    embu: 'Central',
    meru: 'Central',
    nyandarua: 'Central',
    nakuru: 'Rift Valley',
    'uasin-gishu': 'Rift Valley',
    baringo: 'Rift Valley',
    laikipia: 'Rift Valley',
    narok: 'Rift Valley',
    kericho: 'Rift Valley',
    bomet: 'Rift Valley',
    nandi: 'Rift Valley',
    'elgeyo-marakwet': 'Rift Valley',
    'trans-nzoia': 'Rift Valley',
    turkana: 'Rift Valley',
    'west-pokot': 'Rift Valley',
    samburu: 'Rift Valley',
    kakamega: 'Western',
    bungoma: 'Western',
    busia: 'Western',
    vihiga: 'Western',
    kisumu: 'Nyanza',
    kisii: 'Nyanza',
    nyamira: 'Nyanza',
    siaya: 'Nyanza',
    'homa-bay': 'Nyanza',
    migori: 'Nyanza',
    kitui: 'Eastern',
    makueni: 'Eastern',
    isiolo: 'Eastern',
    marsabit: 'Northern',
    mandera: 'Northern',
    wajir: 'Northern',
    garissa: 'Northern',
}

/**
 * Generate paragraph-form content from structured facts.
 * Used for non-flagship locations that don't have custom prose.
 */
function generateContent(facts: LocationFacts): {
    description: string
    housingSnapshotText: string
} {
    const priceBandLabel: Record<PriceBand, string> = {
        budget: 'an affordable rental market',
        mid: 'a mid-market rental landscape',
        premium: 'a premium rental market',
        luxury: 'a luxury rental market',
        mixed: 'a rental market that spans every price band',
    }

    const description = [
        `${facts.name} has ${priceBandLabel[facts.priceBand]} with stock weighted towards ${facts.commonTypes.slice(0, 2).join(' and ').toLowerCase()}.`,
        `The county is best suited to ${facts.bestFor.slice(0, 2).join(' and ').toLowerCase()}.`,
        `Typical listings offer ${facts.highlights.slice(0, 2).join('; ').toLowerCase()}.`,
        `Before signing, confirm the specifics that matter most in this market: ${facts.whatToKnow[0]?.toLowerCase() ?? 'water supply, security and internet.'}`,
    ].join(' ')

    const housingSnapshotText = `Stock in ${facts.name} is mostly ${facts.commonTypes.join(', ').toLowerCase()}, positioned for ${facts.bestFor.slice(0, 2).join(' and ').toLowerCase()}.`

    return { description, housingSnapshotText }
}

/**
 * Resolve full content for a given county slug.
 * Falls back to template-generated content if the county has no flagship entry.
 */
export function getLocationContent(
    slug: string,
    displayName: string,
): LocationContent {
    const flagshipEntry = COUNTY_FACTS[slug]

    if (flagshipEntry) {
        const base: LocationFacts = {
            slug: flagshipEntry.slug,
            name: flagshipEntry.name,
            region: flagshipEntry.region,
            tagline: flagshipEntry.tagline,
            priceBand: flagshipEntry.priceBand,
            commonTypes: flagshipEntry.commonTypes,
            bestFor: flagshipEntry.bestFor,
            highlights: flagshipEntry.highlights,
            whatToKnow: flagshipEntry.whatToKnow,
            keywords: flagshipEntry.keywords,
        }

        if (flagshipEntry.flagship && flagshipEntry.flagshipDescription) {
            return {
                ...base,
                description: flagshipEntry.flagshipDescription,
                housingSnapshotText: generateContent(base).housingSnapshotText,
                hasFlagshipContent: true,
            }
        }

        return {
            ...base,
            ...generateContent(base),
            hasFlagshipContent: false,
        }
    }

    const facts = defaultFacts(slug, displayName)
    facts.region = REGION_BY_COUNTY[slug] ?? 'Central'

    return {
        ...facts,
        ...generateContent(facts),
        hasFlagshipContent: false,
    }
}

/**
 * List all counties in the catalog. Used by /locations index page.
 */
export function listAllCounties(catalog: {
    counties: Array<{
        name: string
        code: string
        cities: Array<{ name: string }>
    }>
}): Array<{
    slug: string
    name: string
    code: string
    region: Region
    cityCount: number
    tagline: string
}> {
    return catalog.counties.map(county => {
        const slug = slugify(county.name)
        const flagship = COUNTY_FACTS[slug]

        return {
            slug,
            name: county.name,
            code: county.code,
            region: REGION_BY_COUNTY[slug] ?? 'Central',
            cityCount: county.cities.length,
            tagline:
                flagship?.tagline ??
                `Explore verified listings across ${county.name}, Kenya.`,
        }
    })
}

function slugify(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

export { slugify }

<?php

namespace App\Domain\Properties\Queries;

use App\Models\Property;

class PropertyDetailQuery
{
    public function handle(string $slug): ?Property
    {
        return Property::query()
            ->with(['county', 'city', 'neighborhood', 'propertyType', 'amenities', 'images'])
            ->where('listing_status', 'published')
            ->where('slug', $slug)
            ->first();
    }
}

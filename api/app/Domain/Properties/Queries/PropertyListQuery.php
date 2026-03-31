<?php

namespace App\Domain\Properties\Queries;

use App\Models\Property;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class PropertyListQuery
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function handle(array $filters): LengthAwarePaginator
    {
        $query = Property::query()
            ->with(['county', 'city', 'neighborhood', 'propertyType', 'images'])
            ->where('listing_status', 'published');

        $this->applyFilters($query, $filters);
        $this->applySorting($query, $filters['sortBy'] ?? 'newest');

        $perPage = (int) ($filters['perPage'] ?? 12);

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private function applyFilters(Builder $query, array $filters): void
    {
        $query
            ->when($filters['county'] ?? null, function (Builder $query, string $county): void {
                $query->whereHas('county', fn (Builder $countyQuery) => $countyQuery->where('slug', $county));
            })
            ->when($filters['city'] ?? null, function (Builder $query, string $city): void {
                $query->whereHas('city', fn (Builder $cityQuery) => $cityQuery->where('slug', $city));
            })
            ->when($filters['neighborhood'] ?? null, function (Builder $query, string $neighborhood): void {
                $query->whereHas('neighborhood', fn (Builder $neighborhoodQuery) => $neighborhoodQuery->where('slug', $neighborhood));
            })
            ->when($filters['propertyType'] ?? null, function (Builder $query, string $propertyType): void {
                $query->whereHas('propertyType', fn (Builder $typeQuery) => $typeQuery->where('slug', $propertyType));
            })
            ->when($filters['listingPurpose'] ?? null, fn (Builder $query, string $purpose) => $query->where('listing_purpose', $purpose))
            ->when($filters['minPrice'] ?? null, fn (Builder $query, float|int|string $minPrice) => $query->where('price', '>=', $minPrice))
            ->when($filters['maxPrice'] ?? null, fn (Builder $query, float|int|string $maxPrice) => $query->where('price', '<=', $maxPrice))
            ->when($filters['bedrooms'] ?? null, fn (Builder $query, int|string $bedrooms) => $query->where('bedrooms', $bedrooms))
            ->when($filters['bathrooms'] ?? null, fn (Builder $query, int|string $bathrooms) => $query->where('bathrooms', $bathrooms))
            ->when($filters['amenities'] ?? null, function (Builder $query, array $amenities): void {
                $query->whereHas('amenities', fn (Builder $amenityQuery) => $amenityQuery->whereIn('slug', $amenities));
            })
            ->when(array_key_exists('petsAllowed', $filters), fn (Builder $query) => $query->where('pets_allowed', (bool) $filters['petsAllowed']))
            ->when(array_key_exists('furnished', $filters), function (Builder $query): void {
                if ((bool) $filters['furnished']) {
                    $query->whereNotNull('furnishing_status');
                    return;
                }

                $query->whereNull('furnishing_status');
            });
    }

    private function applySorting(Builder $query, string $sortBy): void
    {
        match ($sortBy) {
            'price_asc' => $query->orderBy('price')->orderByDesc('published_at'),
            'price_desc' => $query->orderByDesc('price')->orderByDesc('published_at'),
            default => $query->orderByDesc('published_at')->orderByDesc('created_at'),
        };
    }
}

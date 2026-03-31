<?php

namespace App\Domain\Properties\Data;

use App\Models\Property;

readonly class PropertyData
{
    /**
     * @param  list<string>  $amenities
     * @param  list<array{id: string, url: string, altText: ?string, isCover: bool}>  $gallery
     * @param  array{latitude: float, longitude: float}|null  $coordinates
     */
    public function __construct(
        public string $id,
        public string $slug,
        public string $title,
        public string $summary,
        public float $price,
        public string $currency,
        public string $listingPurpose,
        public string $listingStatus,
        public ?int $bedrooms,
        public ?int $bathrooms,
        public string $county,
        public ?string $city,
        public ?string $neighborhood,
        public ?string $propertyType,
        public ?string $coverImageUrl,
        public bool $isFeatured,
        public string $description,
        public array $amenities,
        public array $gallery,
        public ?array $coordinates,
    ) {
    }

    public static function fromModel(Property $property): self
    {
        return new self(
            id: $property->id,
            slug: $property->slug,
            title: $property->title,
            summary: $property->summary,
            price: (float) $property->price,
            currency: 'KES',
            listingPurpose: $property->listing_purpose,
            listingStatus: $property->listing_status,
            bedrooms: $property->bedrooms,
            bathrooms: $property->bathrooms,
            county: $property->county?->name ?? '',
            city: $property->city?->name,
            neighborhood: $property->neighborhood?->name,
            propertyType: $property->propertyType?->name,
            coverImageUrl: null,
            isFeatured: $property->featured_at !== null,
            description: $property->description,
            amenities: $property->relationLoaded('amenities')
                ? $property->amenities->pluck('name')->values()->all()
                : [],
            gallery: $property->relationLoaded('images')
                ? $property->images->map(fn ($image): array => [
                    'id' => $image->id,
                    'url' => $image->url,
                    'altText' => $image->alt_text,
                    'isCover' => (bool) $image->is_cover,
                ])->values()->all()
                : [],
            coordinates: $property->latitude !== null && $property->longitude !== null
                ? [
                    'latitude' => (float) $property->latitude,
                    'longitude' => (float) $property->longitude,
                ]
                : null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function cardArray(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'summary' => $this->summary,
            'price' => $this->price,
            'currency' => $this->currency,
            'listingPurpose' => $this->listingPurpose,
            'listingStatus' => $this->listingStatus,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'county' => $this->county,
            'city' => $this->city,
            'neighborhood' => $this->neighborhood,
            'propertyType' => $this->propertyType,
            'coverImageUrl' => $this->coverImageUrl,
            'isFeatured' => $this->isFeatured,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function detailArray(): array
    {
        return [
            ...$this->cardArray(),
            'description' => $this->description,
            'amenities' => $this->amenities,
            'gallery' => $this->gallery,
            'coordinates' => $this->coordinates,
        ];
    }
}

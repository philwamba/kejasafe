<?php

namespace App\Domain\Properties\Actions;

use App\Models\City;
use App\Models\County;
use App\Models\Neighborhood;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\PropertyType;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StorePropertyAction
{
    /**
     * Persist a new property submission from an authenticated owner.
     *
     * @param  array<string, mixed>  $data  Validated payload from StorePropertyRequest.
     */
    public function execute(User $owner, array $data): Property
    {
        return DB::transaction(function () use ($owner, $data) {
            /** @var County $county */
            $county = County::query()->where('slug', $data['countySlug'])->firstOrFail();
            /** @var PropertyType $type */
            $type = PropertyType::query()->where('slug', $data['propertyTypeSlug'])->firstOrFail();

            $city = null;
            if (!empty($data['citySlug'])) {
                $city = City::query()
                    ->where('county_id', $county->id)
                    ->where('slug', $data['citySlug'])
                    ->first();
            }

            $neighborhood = null;
            if (!empty($data['neighborhoodSlug'])) {
                $neighborhood = Neighborhood::query()
                    ->where('county_id', $county->id)
                    ->where('slug', $data['neighborhoodSlug'])
                    ->first();
            }

            $baseSlug = Str::slug($data['title']);
            $slug = $baseSlug;
            $attempt = 1;
            while (Property::query()->where('slug', $slug)->exists()) {
                $attempt++;
                $slug = "{$baseSlug}-{$attempt}";
            }

            /** @var Property $property */
            $property = Property::query()->create([
                'owner_id' => $owner->id,
                'property_type_id' => $type->id,
                'county_id' => $county->id,
                'city_id' => $city?->id,
                'neighborhood_id' => $neighborhood?->id,
                'owner_type' => $data['ownerType'],
                'title' => $data['title'],
                'slug' => $slug,
                'summary' => $data['summary'],
                'description' => $data['description'],
                'listing_purpose' => $data['listingPurpose'],
                'listing_status' => 'draft',
                'moderation_status' => 'pending_review',
                'price' => $data['price'],
                'deposit' => $data['deposit'] ?? null,
                'billing_period' => $data['billingPeriod'] ?? null,
                'bedrooms' => $data['bedrooms'] ?? null,
                'bathrooms' => $data['bathrooms'] ?? null,
                'furnishing_status' => $data['furnishingStatus'] ?? null,
                'pets_allowed' => $data['petsAllowed'] ?? false,
                'parking_slots' => $data['parkingSlots'] ?? null,
                'latitude' => $data['latitude'] ?? null,
                'longitude' => $data['longitude'] ?? null,
                'address_line_1' => $data['addressLine1'] ?? null,
                'submitted_at' => now(),
                'ownership_declared_at' => now(),
                'responsibility_accepted_at' => now(),
            ]);

            foreach ($data['images'] as $image) {
                PropertyImage::query()->create([
                    'property_id' => $property->id,
                    'storage_key' => $image['storageKey'],
                    'url' => $image['url'],
                    'alt_text' => $image['altText'] ?? null,
                    'position' => $image['position'],
                    'is_cover' => $image['isCover'],
                ]);
            }

            activity('property')
                ->performedOn($property)
                ->causedBy($owner)
                ->withProperties([
                    'action' => 'property.submitted',
                    'listing_purpose' => $property->listing_purpose,
                    'county' => $county->name,
                ])
                ->log('Property submitted for review');

            return $property;
        });
    }
}

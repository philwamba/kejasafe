<?php

namespace App\Http\Requests\Property;

use App\Http\Requests\BaseApiRequest;

class StorePropertyRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:6', 'max:180'],
            'summary' => ['required', 'string', 'min:20', 'max:400'],
            'description' => ['required', 'string', 'min:60', 'max:5000'],

            'propertyTypeSlug' => ['required', 'string', 'exists:property_types,slug'],
            'countySlug' => ['required', 'string', 'exists:counties,slug'],
            'citySlug' => ['nullable', 'string'],
            'neighborhoodSlug' => ['nullable', 'string'],

            'listingPurpose' => ['required', 'in:rent,sale,short_stay'],
            'price' => ['required', 'numeric', 'min:1', 'max:1000000000'],
            'deposit' => ['nullable', 'numeric', 'min:0'],
            'billingPeriod' => ['nullable', 'in:monthly,weekly,daily,yearly'],

            'bedrooms' => ['nullable', 'integer', 'min:0', 'max:50'],
            'bathrooms' => ['nullable', 'integer', 'min:0', 'max:50'],
            'furnishingStatus' => ['nullable', 'in:furnished,semi_furnished,unfurnished'],
            'petsAllowed' => ['nullable', 'boolean'],
            'parkingSlots' => ['nullable', 'integer', 'min:0', 'max:50'],

            'latitude' => ['nullable', 'numeric', 'between:-5,5'],
            'longitude' => ['nullable', 'numeric', 'between:33,42'],
            'addressLine1' => ['nullable', 'string', 'max:200'],

            'ownerType' => ['required', 'in:landlord,agent,property_manager'],
            'contactPhone' => ['required', 'string', 'min:10', 'max:20'],

            'ownershipDeclared' => ['required', 'accepted'],
            'responsibilityAccepted' => ['required', 'accepted'],

            'images' => ['required', 'array', 'min:1', 'max:15'],
            'images.*.storageKey' => ['required', 'string'],
            'images.*.url' => ['required', 'url'],
            'images.*.altText' => ['nullable', 'string', 'max:200'],
            'images.*.position' => ['required', 'integer', 'min:0'],
            'images.*.isCover' => ['required', 'boolean'],
        ];
    }
}

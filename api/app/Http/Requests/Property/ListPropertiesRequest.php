<?php

namespace App\Http\Requests\Property;

use App\Http\Requests\BaseApiRequest;
use App\Models\Property;
use Illuminate\Validation\Rule;

class ListPropertiesRequest extends BaseApiRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            ...$this->paginationRules(),
            'county' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'neighborhood' => ['nullable', 'string', 'max:100'],
            'propertyType' => ['nullable', 'string', 'max:100'],
            'listingPurpose' => ['nullable', Rule::in(['rent', 'sale', 'short_stay'])],
            'minPrice' => ['nullable', 'numeric', 'min:0'],
            'maxPrice' => ['nullable', 'numeric', 'min:0'],
            'bedrooms' => ['nullable', 'integer', 'min:0', 'max:20'],
            'bathrooms' => ['nullable', 'integer', 'min:0', 'max:20'],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['string', 'max:100'],
            'petsAllowed' => ['nullable', 'boolean'],
            'furnished' => ['nullable', 'boolean'],
            'sortBy' => ['nullable', Rule::in(['newest', 'price_asc', 'price_desc'])],
            'status' => ['nullable', Rule::in([
                'draft',
                'pending_review',
                'approved',
                'rejected',
                'published',
                'archived',
                'suspended',
            ])],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function filters(): array
    {
        return $this->validated();
    }
}

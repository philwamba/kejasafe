<?php

namespace App\Http\Resources\Property;

use App\Domain\Properties\Data\PropertyData;
use App\Http\Resources\ApiResource;
use Illuminate\Http\Request;

class PropertyCardResource extends ApiResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return PropertyData::fromModel($this->resource)->cardArray();
    }
}

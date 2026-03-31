<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $fillable = [
        'owner_id',
        'property_type_id',
        'county_id',
        'city_id',
        'neighborhood_id',
        'owner_type',
        'title',
        'slug',
        'summary',
        'description',
        'listing_purpose',
        'listing_status',
        'moderation_status',
        'price',
        'deposit',
        'service_charge',
        'billing_period',
        'size_value',
        'size_unit',
        'bedrooms',
        'bathrooms',
        'toilets',
        'furnishing_status',
        'pets_allowed',
        'parking_slots',
        'has_security_features',
        'has_water_availability',
        'has_internet_availability',
        'negotiable',
        'latitude',
        'longitude',
        'address_line_1',
        'address_line_2',
        'moderation_notes',
        'rejection_reason',
        'featured_at',
        'published_at',
        'expires_at',
        'available_from',
        'occupancy_status',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'deposit' => 'decimal:2',
            'service_charge' => 'decimal:2',
            'size_value' => 'decimal:2',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'pets_allowed' => 'boolean',
            'has_security_features' => 'boolean',
            'has_water_availability' => 'boolean',
            'has_internet_availability' => 'boolean',
            'negotiable' => 'boolean',
            'featured_at' => 'datetime',
            'published_at' => 'datetime',
            'expires_at' => 'datetime',
            'available_from' => 'datetime',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function propertyType(): BelongsTo
    {
        return $this->belongsTo(PropertyType::class);
    }

    public function county(): BelongsTo
    {
        return $this->belongsTo(County::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function neighborhood(): BelongsTo
    {
        return $this->belongsTo(Neighborhood::class);
    }

    public function versions(): HasMany
    {
        return $this->hasMany(PropertyVersion::class);
    }

    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(Amenity::class, 'property_amenity');
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->orderBy('position');
    }
}

<?php

namespace App\Domain\Properties\Policies;

use App\Models\Property;
use App\Models\User;

class PropertyPolicy
{
    public function viewAny(?User $user): bool
    {
        return $user?->effectivePermissions()->contains('name', 'manage_listings') ?? false;
    }

    public function view(?User $user, Property $property): bool
    {
        if ($property->listing_status === 'published') {
            return true;
        }

        if ($user === null) {
            return false;
        }

        return $property->owner_id === $user->id
            || $user->effectivePermissions()->contains('name', 'manage_listings')
            || $user->effectivePermissions()->contains('name', 'approve_listings');
    }

    public function create(User $user): bool
    {
        return $user->effectivePermissions()->contains('name', 'manage_listings');
    }

    public function update(User $user, Property $property): bool
    {
        return $property->owner_id === $user->id
            || $user->effectivePermissions()->contains('name', 'manage_listings');
    }

    public function moderate(User $user): bool
    {
        return $user->effectivePermissions()->contains('name', 'approve_listings');
    }
}

<?php

namespace App\Domain\Properties\Actions;

use App\Models\Property;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ModeratePropertyAction
{
    public function approve(User $moderator, Property $property, ?string $notes = null): Property
    {
        return DB::transaction(function () use ($moderator, $property, $notes) {
            $property->update([
                'moderation_status' => 'approved',
                'listing_status' => 'published',
                'published_at' => now(),
                'reviewed_at' => now(),
                'reviewed_by_user_id' => $moderator->id,
                'moderation_notes' => $notes,
                'rejection_reason' => null,
            ]);

            activity('property')
                ->performedOn($property)
                ->causedBy($moderator)
                ->withProperties([
                    'action' => 'property.approved',
                    'notes' => $notes,
                ])
                ->log('Property approved');

            return $property->fresh();
        });
    }

    public function reject(User $moderator, Property $property, string $reason, ?string $notes = null): Property
    {
        return DB::transaction(function () use ($moderator, $property, $reason, $notes) {
            $property->update([
                'moderation_status' => 'rejected',
                'listing_status' => 'draft',
                'reviewed_at' => now(),
                'reviewed_by_user_id' => $moderator->id,
                'rejection_reason' => $reason,
                'moderation_notes' => $notes,
            ]);

            activity('property')
                ->performedOn($property)
                ->causedBy($moderator)
                ->withProperties([
                    'action' => 'property.rejected',
                    'reason' => $reason,
                    'notes' => $notes,
                ])
                ->log('Property rejected');

            return $property->fresh();
        });
    }
}

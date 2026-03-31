<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BackendSetting extends Model
{
    use HasFactory;
    use HasUuids;

    protected $fillable = [
        'active_mode',
        'fallback_mode',
        'version',
        'last_switched_by_user_id',
        'last_switched_at',
        'last_sync_at',
        'switch_notes',
    ];

    protected function casts(): array
    {
        return [
            'last_switched_at' => 'datetime',
            'last_sync_at' => 'datetime',
        ];
    }

    public function lastSwitchedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'last_switched_by_user_id');
    }
}

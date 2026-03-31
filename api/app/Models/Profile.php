<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
    use HasFactory;
    use HasUuids;

    protected $fillable = [
        'user_id',
        'bio',
        'national_id_number',
        'company_name',
        'job_title',
        'address_line_1',
        'address_line_2',
        'city',
        'country',
        'postal_code',
        'completion_score',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

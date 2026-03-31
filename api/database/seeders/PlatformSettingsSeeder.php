<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PlatformSettingsSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::table('backend_settings')->updateOrInsert(
            ['active_mode' => 'prisma_neon'],
            [
                'id' => (string) Str::uuid(),
                'fallback_mode' => 'laravel_api',
                'version' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        );
    }
}

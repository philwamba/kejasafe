<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PlatformSettingsSeeder::class,
            LocationsSeeder::class,
            PropertyTypesSeeder::class,
        ]);

        User::factory()->create([
            'full_name' => 'Kejasafe Admin',
            'email' => 'test@example.com',
        ]);

        $this->call([
            RolesAndPermissionsSeeder::class,
        ]);
    }
}

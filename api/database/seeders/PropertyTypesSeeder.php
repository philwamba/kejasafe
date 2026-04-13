<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PropertyTypesSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['Apartment', 'Self-contained residential unit in a multi-unit building.'],
            ['Bedsitter', 'Single-room unit combining living and sleeping space, typically with shared or en-suite bathroom.'],
            ['Studio', 'Open-plan single-room unit with kitchenette and en-suite bathroom.'],
            ['Single Room', 'Basic single room, often with shared facilities.'],
            ['One Bedroom', 'Apartment with one bedroom separate from the living area.'],
            ['Two Bedroom', 'Apartment with two bedrooms.'],
            ['Three Bedroom', 'Apartment with three bedrooms.'],
            ['Four Bedroom', 'Apartment or house with four bedrooms.'],
            ['Maisonette', 'Multi-level residential unit, usually within a larger building or compound.'],
            ['Bungalow', 'Single-storey detached house.'],
            ['Townhouse', 'Attached multi-storey house sharing walls with neighbours.'],
            ['Villa', 'Detached luxury house, often gated.'],
            ['Mansion', 'Large luxury detached house.'],
            ['Penthouse', 'Top-floor luxury apartment.'],
            ['Hostel / Student Housing', 'Accommodation designed primarily for students.'],
            ['Office', 'Commercial office space.'],
            ['Shop', 'Retail commercial space.'],
            ['Warehouse', 'Industrial or storage space.'],
            ['Land / Plot', 'Undeveloped land for sale or lease.'],
            ['Commercial Building', 'Full commercial building.'],
        ];

        foreach ($types as [$name, $description]) {
            $slug = Str::slug($name);
            $exists = DB::table('property_types')->where('slug', $slug)->exists();

            if (!$exists) {
                DB::table('property_types')->insert([
                    'id' => (string) Str::uuid(),
                    'name' => $name,
                    'slug' => $slug,
                    'description' => $description,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}

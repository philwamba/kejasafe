<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\County;
use App\Models\Neighborhood;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class LocationsSeeder extends Seeder
{
    public function run(): void
    {
        $catalog = json_decode(
            File::get(base_path('../data/locations/kenya.json')),
            true,
            512,
            JSON_THROW_ON_ERROR,
        );

        foreach ($catalog['counties'] as $countyEntry) {
            $county = County::query()->updateOrCreate(
                ['slug' => Str::slug($countyEntry['name'])],
                [
                    'name' => $countyEntry['name'],
                    'code' => $countyEntry['code'],
                ],
            );

            foreach ($countyEntry['cities'] as $cityEntry) {
                $city = City::query()->updateOrCreate(
                    [
                        'county_id' => $county->id,
                        'slug' => Str::slug($cityEntry['name']),
                    ],
                    [
                        'name' => $cityEntry['name'],
                    ],
                );

                foreach ($cityEntry['neighborhoods'] as $neighborhoodName) {
                    Neighborhood::query()->updateOrCreate(
                        [
                            'county_id' => $county->id,
                            'slug' => Str::slug($neighborhoodName),
                        ],
                        [
                            'city_id' => $city->id,
                            'name' => $neighborhoodName,
                        ],
                    );
                }
            }
        }
    }
}

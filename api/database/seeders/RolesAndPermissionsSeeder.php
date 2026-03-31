<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $permissionsByGroup = [
            'users' => ['manage_users', 'manage_roles', 'impersonate_users'],
            'listings' => ['manage_listings', 'approve_listings', 'manage_featured_listings'],
            'moderation' => ['moderate_reports', 'manage_property_reviews'],
            'finance' => ['manage_payments', 'manage_plans'],
            'settings' => ['manage_settings', 'switch_backend', 'manage_backend_health'],
            'content' => ['manage_content', 'manage_blog', 'manage_legal_content'],
            'taxonomy' => ['manage_locations', 'manage_amenities'],
            'operations' => [
                'manage_inquiries',
                'manage_bookings',
                'manage_notifications',
                'manage_support_tickets',
                'export_reports',
                'view_audit_logs',
            ],
        ];

        $permissionIds = [];

        foreach ($permissionsByGroup as $group => $permissions) {
          foreach ($permissions as $permissionName) {
                $permission = Permission::query()->updateOrCreate(
                    ['name' => $permissionName],
                    [
                        'guard_name' => 'web',
                        'group' => $group,
                        'description' => ucfirst(str_replace('_', ' ', $permissionName)),
                    ],
                );

                $permissionIds[$permissionName] = $permission->id;
            }
        }

        $roleMap = [
            'super_admin' => array_keys($permissionIds),
            'admin' => [
                'manage_users',
                'manage_listings',
                'approve_listings',
                'moderate_reports',
                'manage_settings',
                'view_audit_logs',
                'manage_content',
                'manage_blog',
                'manage_locations',
                'manage_amenities',
                'manage_inquiries',
                'manage_bookings',
                'export_reports',
                'manage_notifications',
                'manage_support_tickets',
                'manage_backend_health',
                'manage_property_reviews',
                'manage_featured_listings',
                'manage_plans',
                'manage_legal_content',
            ],
            'moderator' => [
                'manage_listings',
                'approve_listings',
                'moderate_reports',
                'manage_inquiries',
                'manage_bookings',
                'manage_property_reviews',
            ],
            'support' => [
                'manage_inquiries',
                'manage_bookings',
                'manage_notifications',
                'manage_support_tickets',
            ],
            'landlord' => ['manage_listings', 'manage_inquiries', 'manage_bookings'],
            'agent' => ['manage_listings', 'manage_inquiries', 'manage_bookings'],
            'tenant' => [],
            'viewer' => [],
            'property_manager' => ['manage_listings', 'manage_inquiries', 'manage_bookings'],
            'accountant' => ['manage_payments', 'export_reports', 'manage_plans'],
        ];

        foreach ($roleMap as $roleName => $rolePermissions) {
            $role = Role::query()->updateOrCreate(
                ['name' => $roleName],
                [
                    'guard_name' => 'web',
                    'description' => ucfirst(str_replace('_', ' ', $roleName)),
                    'is_system' => true,
                ],
            );

            $role->permissions()->sync(
                collect($rolePermissions)
                    ->map(fn (string $permissionName): ?string => $permissionIds[$permissionName] ?? null)
                    ->filter()
                    ->values()
                    ->all(),
            );
        }

        $adminUser = User::query()->where('email', 'test@example.com')->first();

        if ($adminUser !== null) {
            $superAdminRole = Role::query()->where('name', 'super_admin')->first();

            if ($superAdminRole !== null) {
                $adminUser->roles()->syncWithoutDetaching([$superAdminRole->id]);
            }
        }
    }
}

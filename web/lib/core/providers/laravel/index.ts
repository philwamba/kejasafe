import type { ApplicationProvider } from '@/lib/core/contracts/providers'
import { laravelAdminProvider } from '@/lib/core/providers/laravel/admin'
import { laravelAuthProvider } from '@/lib/core/providers/laravel/auth'
import { laravelCatalogProvider } from '@/lib/core/providers/laravel/catalog'
import { laravelDashboardProvider } from '@/lib/core/providers/laravel/dashboard'
import { laravelPropertyProvider } from '@/lib/core/providers/laravel/properties'
import { laravelSystemProvider } from '@/lib/core/providers/laravel/system'

export const laravelApiProvider: ApplicationProvider = {
    mode: 'laravel_api',
    auth: laravelAuthProvider,
    admin: laravelAdminProvider,
    catalog: laravelCatalogProvider,
    dashboard: laravelDashboardProvider,
    properties: laravelPropertyProvider,
    system: laravelSystemProvider,
}

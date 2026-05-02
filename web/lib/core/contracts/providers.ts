import type { AuthProvider } from '@/lib/core/contracts/auth'
import type { AdminProvider } from '@/lib/core/contracts/admin'
import type { CatalogProvider } from '@/lib/core/contracts/catalog'
import type { BackendMode } from '@/lib/core/contracts/common'
import type { DashboardProvider } from '@/lib/core/contracts/dashboard'
import type { PropertyProvider } from '@/lib/core/contracts/property'
import type { SystemProvider } from '@/lib/core/contracts/system'

export interface ApplicationProvider {
    mode: BackendMode
    auth: AuthProvider
    admin: AdminProvider
    catalog: CatalogProvider
    dashboard: DashboardProvider
    properties: PropertyProvider
    system: SystemProvider
}

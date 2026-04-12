import type { AuthProvider } from '@/lib/core/contracts/auth'
import type { BackendMode } from '@/lib/core/contracts/common'
import type { PropertyProvider } from '@/lib/core/contracts/property'
import type { SystemProvider } from '@/lib/core/contracts/system'

export interface ApplicationProvider {
    mode: BackendMode
    auth: AuthProvider
    properties: PropertyProvider
    system: SystemProvider
}

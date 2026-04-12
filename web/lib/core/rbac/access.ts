import type { Permission } from '@/lib/core/rbac/permissions'

export function hasPermission(
    permissions: string[],
    requiredPermission: Permission,
): boolean {
    return permissions.includes(requiredPermission)
}

export function hasAnyPermission(
    permissions: string[],
    requiredPermissions: Permission[],
): boolean {
    return requiredPermissions.some(permission =>
        permissions.includes(permission),
    )
}

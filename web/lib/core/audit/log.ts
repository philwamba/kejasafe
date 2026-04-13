import { prisma } from '@/lib/core/prisma/client'
import type { BackendMode, RequestContext } from '@/lib/core/contracts/common'

export type AuditLevel = 'info' | 'warning' | 'critical'

export interface AuditLogEntry {
    actorUserId?: string | null
    action: string
    entityType: string
    entityId: string
    backendProcessedBy?: BackendMode
    level?: AuditLevel
    metadata?: Record<string, unknown>
    ctx?: RequestContext
}

/**
 * Write an entry to the audit log. Non-blocking — failures are logged but
 * must not interrupt the caller's business flow.
 */
export async function writeAuditLog(entry: AuditLogEntry): Promise<void> {
    try {
        await prisma.auditLog.create({
            data: {
                actorUserId: entry.actorUserId ?? null,
                action: entry.action,
                entityType: entry.entityType,
                entityId: entry.entityId,
                backendProcessedBy: entry.backendProcessedBy ?? 'prisma_neon',
                level: entry.level ?? 'info',
                ipAddress: entry.ctx?.ipAddress ?? null,
                userAgent: entry.ctx?.userAgent ?? null,
                metadata: entry.metadata
                    ? JSON.parse(JSON.stringify(entry.metadata))
                    : null,
            },
        })
    } catch (error) {
        console.error('[audit] Failed to write audit log entry', {
            action: entry.action,
            entityType: entry.entityType,
            entityId: entry.entityId,
            error,
        })
    }
}

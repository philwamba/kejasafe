import type { BackendMode, RequestContext } from "@/lib/core/contracts/common";

export interface BackendSettingDto {
  id: string;
  activeMode: BackendMode;
  fallbackMode?: BackendMode | null;
  version: number;
  lastSwitchedAt?: string | null;
  lastSwitchedByUserId?: string | null;
  lastSyncAt?: string | null;
  switchNotes?: string | null;
}

export interface BackendHealthDto {
  mode: BackendMode;
  isHealthy: boolean;
  latencyMs: number;
  checkedAt: string;
  details?: Record<string, unknown>;
}

export interface SystemProviderContract {
  activeBackend(ctx: RequestContext): Promise<BackendMode>;
  health(ctx: RequestContext): Promise<BackendHealthDto>;
}

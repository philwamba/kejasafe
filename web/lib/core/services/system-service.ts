import type { BackendMode, RequestContext } from "@/lib/core/contracts/common";
import {
  getConfiguredBackendMode,
  getConfiguredBackendSetting,
  listSystemHealth,
  switchConfiguredBackend,
} from "@/lib/core/system/control-plane";

export async function resolveActiveBackend(
  ctx: RequestContext,
  mode?: BackendMode,
) {
  if (mode) {
    return mode;
  }

  return getConfiguredBackendMode();
}

export { getConfiguredBackendSetting, listSystemHealth, switchConfiguredBackend };

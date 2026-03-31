import { env } from "@/lib/config/env";
import type { BackendMode } from "@/lib/core/contracts/common";
import type { ApplicationProvider } from "@/lib/core/contracts/providers";
import { laravelApiProvider } from "@/lib/core/providers/laravel";
import { prismaProvider } from "@/lib/core/providers/prisma";

const providerMap: Record<BackendMode, ApplicationProvider> = {
  prisma_neon: prismaProvider,
  laravel_api: laravelApiProvider,
};

export function getProvider(mode?: BackendMode): ApplicationProvider {
  const resolvedMode = (mode ?? env.ACTIVE_BACKEND_MODE) as BackendMode;

  return providerMap[resolvedMode];
}

export function getFallbackProvider(
  currentMode: BackendMode,
): ApplicationProvider | null {
  const fallbackMode = env.BACKEND_FALLBACK_MODE as BackendMode | undefined;

  if (!fallbackMode || fallbackMode === currentMode) {
    return null;
  }

  return providerMap[fallbackMode];
}

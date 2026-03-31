import type { ApplicationProvider } from "@/lib/core/contracts/providers";
import { laravelAuthProvider } from "@/lib/core/providers/laravel/auth";
import { laravelPropertyProvider } from "@/lib/core/providers/laravel/properties";
import { laravelSystemProvider } from "@/lib/core/providers/laravel/system";

export const laravelApiProvider: ApplicationProvider = {
  mode: "laravel_api",
  auth: laravelAuthProvider,
  properties: laravelPropertyProvider,
  system: laravelSystemProvider,
};

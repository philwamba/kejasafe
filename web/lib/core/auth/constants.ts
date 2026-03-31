export const authCookieNames = {
  session: "kejasafe_session",
  refresh: "kejasafe_refresh",
  csrf: "kejasafe_csrf",
  backendMode: "kejasafe_backend_mode",
} as const;

export const authRoutePrefixes = [
  "/dashboard",
  "/portal",
  "/admin",
] as const;

import axios, { AxiosError, AxiosResponse } from "axios";

import { env } from "@/lib/config/env";
import { AppError, statusToErrorCode } from "@/lib/core/errors";
import { logger } from "@/lib/core/logger";
import type { ApiErrorEnvelope } from "@/lib/shared/types/api";

export const internalApiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "X-App-Client": "kejasafe-web",
  },
});

export const laravelApiClient = axios.create({
  baseURL: env.LARAVEL_API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "X-App-Client": "kejasafe-web",
  },
});

for (const client of [internalApiClient, laravelApiClient]) {
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ApiErrorEnvelope>) => {
      const message =
        error.response?.data?.message ??
        error.message ??
        "An unexpected request error occurred.";

      logger.warn("HTTP client request failed.", {
        status: error.response?.status,
        message,
        code: error.response?.data?.code,
      });

      return Promise.reject(
        new AppError(message, {
          status: error.response?.status ?? 500,
          code:
            (error.response?.data?.code as AppError["code"] | undefined) ??
            statusToErrorCode(error.response?.status ?? 500),
          debugToken: error.response?.data?.debugToken,
          fieldErrors: error.response?.data?.fieldErrors,
          details: error.response?.data?.details,
          cause: error,
        }),
      );
    },
  );
}

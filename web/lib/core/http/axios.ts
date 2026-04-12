import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

import { env } from "@/lib/config/env";
import { AppError, statusToErrorCode } from "@/lib/core/errors";
import { logger } from "@/lib/core/logger";
import type { ApiErrorEnvelope } from "@/lib/shared/types/api";

function attachResponseInterceptor(client: AxiosInstance) {
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

export const internalApiClient = axios.create({
  withCredentials: true,
  headers: {
    "X-App-Client": "kejasafe-web",
  },
});

internalApiClient.interceptors.request.use((config) => ({
  ...config,
  baseURL: config.baseURL ?? env.NEXT_PUBLIC_API_BASE_URL,
}));

export const laravelApiClient = axios.create({
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "X-App-Client": "kejasafe-web",
  },
});

laravelApiClient.interceptors.request.use((config) => ({
  ...config,
  baseURL: config.baseURL ?? env.LARAVEL_API_BASE_URL,
}));

attachResponseInterceptor(internalApiClient);
attachResponseInterceptor(laravelApiClient);

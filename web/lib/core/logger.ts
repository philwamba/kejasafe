type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  requestId?: string;
  backendMode?: string;
  [key: string]: unknown;
}

function writeLog(level: LogLevel, message: string, context?: LogContext) {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context ?? {}),
  };

  switch (level) {
    case "debug":
      console.debug(payload);
      break;
    case "info":
      console.info(payload);
      break;
    case "warn":
      console.warn(payload);
      break;
    case "error":
      console.error(payload);
      break;
  }
}

export const logger = {
  debug(message: string, context?: LogContext) {
    writeLog("debug", message, context);
  },
  info(message: string, context?: LogContext) {
    writeLog("info", message, context);
  },
  warn(message: string, context?: LogContext) {
    writeLog("warn", message, context);
  },
  error(message: string, context?: LogContext) {
    writeLog("error", message, context);
  },
};

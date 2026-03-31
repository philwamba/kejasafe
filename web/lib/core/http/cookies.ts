import type { NextResponse } from "next/server";

function parseSetCookieHeader(header: string) {
  const segments = header.split(";").map((segment) => segment.trim());
  const [nameValue, ...attributes] = segments;
  const separatorIndex = nameValue.indexOf("=");

  const name = nameValue.slice(0, separatorIndex);
  const value = nameValue.slice(separatorIndex + 1);
  const options: Record<string, unknown> = {};

  for (const attribute of attributes) {
    const [rawKey, rawValue] = attribute.split("=");
    const key = rawKey.toLowerCase();

    if (key === "httponly") {
      options.httpOnly = true;
      continue;
    }

    if (key === "secure") {
      options.secure = true;
      continue;
    }

    if (key === "path") {
      options.path = rawValue;
      continue;
    }

    if (key === "domain") {
      options.domain = rawValue;
      continue;
    }

    if (key === "expires") {
      options.expires = new Date(rawValue);
      continue;
    }

    if (key === "max-age") {
      options.maxAge = Number(rawValue);
      continue;
    }

    if (key === "samesite") {
      options.sameSite = rawValue?.toLowerCase();
    }
  }

  return { name, value, options };
}

export function applyForwardedSetCookieHeaders(
  response: NextResponse,
  setCookieHeaders: string[] = [],
) {
  for (const header of setCookieHeaders) {
    const parsed = parseSetCookieHeader(header);

    response.cookies.set(parsed.name, parsed.value, parsed.options);
  }
}

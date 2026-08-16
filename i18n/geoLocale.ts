import type { NextRequest } from "next/server";
import type { Locale } from "./routing";

const UNKNOWN_COUNTRIES = new Set(["", "XX", "T1", "ZZ"]);

function normalizeCountry(value: string | null | undefined): string | null {
  const code = value?.trim().toUpperCase() ?? "";
  if (!code || UNKNOWN_COUNTRIES.has(code)) return null;
  return code;
}

export function localeFromCountry(country: string | null): Locale {
  if (country === "XK" || country === "KV" || country === "AL") return "sq";
  if (country === "MK") return "mk";
  return "en";
}

export function countryFromHeaders(request: NextRequest): string | null {
  return normalizeCountry(
    request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      request.headers.get("cloudfront-viewer-country") ||
      request.headers.get("x-country-code") ||
      request.headers.get("x-appengine-country")
  );
}

function clientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("cf-connecting-ip");

  if (!ip) return null;
  if (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("127.") ||
    ip.startsWith("::ffff:127.")
  ) {
    return null;
  }
  return ip;
}

async function countryFromIp(ip: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://ipwho.is/${encodeURIComponent(ip)}?fields=success,country_code`,
      { signal: AbortSignal.timeout(1500) }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      success?: boolean;
      country_code?: string;
    };
    if (!data.success) return null;
    return normalizeCountry(data.country_code);
  } catch {
    return null;
  }
}

/** Kosovo/Albania → sq, North Macedonia → mk, anywhere else or unknown → en */
export async function detectLocaleFromIp(request: NextRequest): Promise<Locale> {
  const headerCountry = countryFromHeaders(request);
  if (headerCountry) return localeFromCountry(headerCountry);

  const ip = clientIp(request);
  if (!ip) return "en";

  const lookedUp = await countryFromIp(ip);
  return localeFromCountry(lookedUp);
}

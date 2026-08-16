import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing, type Locale } from "./i18n/routing";
import { detectLocaleFromIp } from "./i18n/geoLocale";
import { isLocale, LOCALE_COOKIE, LOCALE_MAX_AGE } from "./i18n/localeCookie";

const handleI18n = createMiddleware(routing);
const locales = new Set<string>(routing.locales);

function withLocaleCookie(response: NextResponse, locale: Locale) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: LOCALE_MAX_AGE,
    sameSite: "lax",
  });
  return response;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);

  // Old /en, /sq, /mk URLs → same page without a locale prefix.
  if (segments.length > 0 && locales.has(segments[0])) {
    const rest = [...segments];
    while (rest.length > 0 && locales.has(rest[0])) rest.shift();
    const url = request.nextUrl.clone();
    url.pathname = rest.length ? `/${rest.join("/")}` : "/";
    return NextResponse.redirect(url);
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale)
    ? cookieLocale
    : await detectLocaleFromIp(request);

  request.cookies.set(LOCALE_COOKIE, locale);
  return withLocaleCookie(handleI18n(request), locale);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|admin|test-supabase|test-carousel|favicon|images|.*\\..*).*)",
  ],
};

import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["sq", "en", "mk"] as const,
  defaultLocale: "en",
  localePrefix: "never",
  localeDetection: true,
  pathnames: {
    "/": "/",
    "/products": "/products",
    "/product/[id]": "/product/[id]",
    "/services": "/services",
    "/home2": "/home2",
  },
});

export type Locale = (typeof routing.locales)[number];

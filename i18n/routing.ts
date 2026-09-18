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
    "/cart": "/cart",
    "/checkout/success": "/checkout/success",
    "/checkout/cancel": "/checkout/cancel",
  },
});

export type Locale = (typeof routing.locales)[number];

"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useLocale } from "next-intl";
import { getProducts, DEFAULT_LOCALE, type Locale } from "@/lib/getProducts";
import ProductsSidebarMobile from "./ProductsSidebarMobile";
import ProductsSidebarDesktop from "./ProductsSidebarDesktop";

interface SupabaseProduct {
  id: number;
  name: string;
  price: string;
  description_1?: string;
  description_2?: string;
  description_3?: string;
  images?: string[];
}

// Whitelist of allowed product names in exact order for sidebar
const ALLOWED_SIDEBAR_PRODUCTS = [
  "Cryo Sport",
  "LedBoots",
  "AVABoots",
  "Actin One",
  "Warm Pro",
  "Foot massager",
  "Deep Light",
  "Bioimpedance scale",
];

export default function ProductsSidebar() {
  const locale = useLocale() as Locale;
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Fetch in Albanian for whitelist matching, then in current locale for display.
        // The whitelist names are Albanian brand names — resolve IDs via sq, then swap in translated rows.
        const [canonicalRows, localizedRows] = await Promise.all([
          getProducts(DEFAULT_LOCALE),
          getProducts(locale),
        ]);
        const localizedById = new Map(localizedRows.map((p) => [p.id, p]));

        const filteredProducts = ALLOWED_SIDEBAR_PRODUCTS.map((allowedName) => {
          const canonical = canonicalRows.find(
            (product) =>
              product.name.toLowerCase().trim() ===
              allowedName.toLowerCase().trim()
          );
          return canonical ? localizedById.get(canonical.id) : undefined;
        }).filter((p): p is SupabaseProduct => p !== undefined);

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    }
    fetchProducts();
  }, [locale]);

  return (
    <>
      {isMobile ? (
        <ProductsSidebarMobile products={products} />
      ) : (
        <ProductsSidebarDesktop products={products} />
      )}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { getProducts } from "@/lib/getProducts";
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
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();

        // Filter and sort products according to whitelist order
        const filteredProducts = ALLOWED_SIDEBAR_PRODUCTS.map((allowedName) => {
          // Find product by name (case-insensitive match)
          return data.find(
            (product) =>
              product.name.toLowerCase().trim() ===
              allowedName.toLowerCase().trim()
          );
        }).filter(
          (product): product is SupabaseProduct => product !== undefined
        );

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    }
    fetchProducts();
  }, []);

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

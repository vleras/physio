import { supabase } from "@/lib/supabase";

export type Locale = "sq" | "en" | "mk";
export const DEFAULT_LOCALE: Locale = "sq";

export interface Product {
  id: number;
  name: string;
  price: string;
  description_1?: string;
  description_2?: string;
  description_3?: string;
  images?: string[];
}

interface TranslationRow {
  locale: Locale;
  name: string;
  description_1: string | null;
  description_2: string | null;
  description_3: string | null;
}

interface ProductRow {
  id: number;
  price: string;
  images: string[] | null;
  display_order: number | null;
  product_translations: TranslationRow[];
}

function pickTranslation(
  translations: TranslationRow[],
  locale: Locale
): TranslationRow | null {
  return (
    translations.find((t) => t.locale === locale) ??
    translations.find((t) => t.locale === DEFAULT_LOCALE) ??
    translations[0] ??
    null
  );
}

function flatten(row: ProductRow, locale: Locale): Product | null {
  const t = pickTranslation(row.product_translations, locale);
  if (!t) return null;
  return {
    id: row.id,
    price: row.price,
    images: row.images ?? undefined,
    name: t.name,
    description_1: t.description_1 ?? undefined,
    description_2: t.description_2 ?? undefined,
    description_3: t.description_3 ?? undefined,
  };
}

const PRODUCT_SELECT =
  "id, price, images, display_order, product_translations ( locale, name, description_1, description_2, description_3 )";

export async function getProducts(
  locale: Locale = DEFAULT_LOCALE
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("Products")
    .select(PRODUCT_SELECT);

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  if (!data || data.length === 0) return [];

  const rows = data as unknown as ProductRow[];

  const sorted = [...rows].sort((a, b) => {
    if (a.display_order != null && b.display_order != null) {
      return a.display_order - b.display_order;
    }
    if (a.display_order != null) return -1;
    if (b.display_order != null) return 1;
    return a.id - b.id;
  });

  return sorted
    .map((row) => flatten(row, locale))
    .filter((p): p is Product => p !== null);
}

export async function getProductById(
  id: number,
  locale: Locale = DEFAULT_LOCALE
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("Products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }
  if (!data) return null;

  return flatten(data as unknown as ProductRow, locale);
}

import { supabase } from "@/lib/supabase";

export interface Product {
  id: number;
  name: string;
  price: string;
  description_1?: string;
  description_2?: string;
  description_3?: string;
  images?: string[];
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("Products")
    .select(
      "id, name, price, description_1, description_2, description_3, images, display_order"
    );

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Sort products: first by display_order (nulls last), then by id
  const sorted = [...data].sort((a, b) => {
    // If both have display_order, sort by it
    if (a.display_order != null && b.display_order != null) {
      return a.display_order - b.display_order;
    }
    // If only a has display_order, it comes first
    if (a.display_order != null && b.display_order == null) {
      return -1;
    }
    // If only b has display_order, it comes first
    if (a.display_order == null && b.display_order != null) {
      return 1;
    }
    // If both are null, sort by id
    return a.id - b.id;
  });

  return sorted as Product[];
}

export async function getProductById(id: number): Promise<Product | null> {
  const { data, error } = await supabase
    .from("Products")
    .select(
      "id, name, price, description_1, description_2, description_3, images"
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return data as Product | null;
}


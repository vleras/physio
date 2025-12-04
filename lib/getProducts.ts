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
      "id, name, price, description_1, description_2, description_3, images"
    )
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return (data || []) as Product[];
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


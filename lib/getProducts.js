import { supabase } from "@/lib/supabase";

export async function getProducts() {
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

  return data || [];
}

export async function getProductById(id) {
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

  return data;
}

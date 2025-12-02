import { supabase } from "@/lib/supabase";

export async function getProducts() {
  const { data, error } = await supabase
    .from("Products")
    .select("*");

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data;
}


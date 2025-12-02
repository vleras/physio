import { supabase } from "@/lib/supabase";

// Get all products
export async function getAllProducts() {
  const { data, error } = await supabase
    .from("Products")
    .select("id, name, price, description_1, description_2, description_3, images")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data || [];
}

// Get a single product by ID
export async function getProductById(id) {
  const { data, error } = await supabase
    .from("Products")
    .select("id, name, price, description_1, description_2, description_3, images")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    throw error;
  }

  return data || null;
}

// Create a new product
export async function createProduct(product) {
  // Validate required fields
  if (!product.name?.trim()) {
    throw new Error("Product name is required");
  }
  if (!product.price?.trim()) {
    throw new Error("Product price is required");
  }

  const insertData = {
    name: product.name.trim(),
    price: product.price.trim(),
    description_1: product.description_1?.trim() || null,
    description_2: product.description_2?.trim() || null,
    description_3: product.description_3?.trim() || null,
    images: Array.isArray(product.images) ? product.images : [],
  };

  const { data, error } = await supabase
    .from("Products")
    .insert([insertData])
    .select(); // Select all columns to return the created row

  if (error) {
    console.error("Error creating product:", error);
    console.error("Error details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(`Failed to create product: ${error.message}`);
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    throw new Error("Product creation succeeded but no data was returned");
  }

  // Return the first item if data is an array, or data itself
  return Array.isArray(data) && data.length > 0 ? data[0] : data;
}

// Update a product
export async function updateProduct(id, product) {
  // Validate ID
  if (!id) {
    throw new Error("Product ID is required");
  }

  // Convert empty strings to null for optional fields
  const updateData = {
    name: product.name?.trim() || "",
    price: product.price?.trim() || "",
    description_1: product.description_1?.trim() || null,
    description_2: product.description_2?.trim() || null,
    description_3: product.description_3?.trim() || null,
    images: Array.isArray(product.images) ? product.images : [],
  };

  // Validate required fields
  if (!updateData.name) {
    throw new Error("Product name is required");
  }
  if (!updateData.price) {
    throw new Error("Product price is required");
  }

  console.log("Updating product with ID:", id);
  console.log("Update data:", updateData);

  // Perform the update with explicit select
  const { data, error } = await supabase
    .from("Products")
    .update(updateData)
    .eq("id", id)
    .select(); // Select all columns - Supabase will return the updated row

  if (error) {
    console.error("Supabase update error:", error);
    console.error("Error details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(`Failed to update product: ${error.message}`);
  }

  // Check if data was returned
  if (!data) {
    console.error("Update query returned no data");
    throw new Error("Update operation returned no data. The product may not exist or RLS policies may be blocking the response.");
  }

  // Handle array response (Supabase returns arrays even for single updates)
  const updatedProduct = Array.isArray(data) ? data[0] : data;

  if (!updatedProduct) {
    console.error("Update succeeded but no product data in response");
    console.error("Response data:", data);
    throw new Error("Update operation completed but no product data was returned. The product may have been updated but the response is empty.");
  }

  console.log("Product updated successfully:", updatedProduct);
  return updatedProduct;
}

// Delete a product
export async function deleteProduct(id) {
  const { error } = await supabase
    .from("Products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    throw error;
  }

  return true;
}


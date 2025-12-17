import { supabase } from "@/lib/supabase";

// Get all products
export async function getAllProducts() {
  const { data, error } = await supabase
    .from("Products")
    .select("id, name, price, description_1, description_2, description_3, images, display_order");

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

  return sorted;
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

  // Get the maximum display_order to set the new product at the end
  const { data: allProducts } = await supabase
    .from("Products")
    .select("display_order");

  let nextOrder = 1;
  if (allProducts && allProducts.length > 0) {
    const maxOrder = Math.max(
      ...allProducts
        .map(p => p.display_order)
        .filter(order => order != null)
    );
    if (maxOrder != null && !isNaN(maxOrder)) {
      nextOrder = maxOrder + 1;
    }
  }

  const insertData = {
    name: product.name.trim(),
    price: product.price.trim(),
    description_1: product.description_1?.trim() || null,
    description_2: product.description_2?.trim() || null,
    description_3: product.description_3?.trim() || null,
    images: Array.isArray(product.images) ? product.images : [],
    display_order: nextOrder,
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

  // Updating product with ID and update data

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

// Update product order
export async function updateProductOrder(productOrders) {
  // productOrders should be an array of { id: number, display_order: number }
  if (!Array.isArray(productOrders) || productOrders.length === 0) {
    throw new Error("Product orders array is required");
  }

  // Update all products in a transaction-like manner
  const updates = productOrders.map(({ id, display_order }) =>
    supabase
      .from("Products")
      .update({ display_order })
      .eq("id", id)
  );

  const results = await Promise.all(updates);
  
  // Check for errors
  const errors = results.filter(result => result.error);
  if (errors.length > 0) {
    console.error("Error updating product orders:", errors);
    throw new Error(`Failed to update product orders: ${errors[0].error.message}`);
  }

  return true;
}


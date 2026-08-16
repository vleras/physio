const API_BASE = "/api/admin/products";

async function apiRequest(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export async function getAllProducts() {
  return apiRequest(API_BASE);
}

export async function getProductById(id) {
  return apiRequest(`${API_BASE}?id=${id}`);
}

export async function createProduct(product) {
  if (!product.translations?.sq?.name?.trim()) {
    throw new Error("Albanian product name is required");
  }
  if (!product.price?.trim()) {
    throw new Error("Product price is required");
  }

  return apiRequest(API_BASE, {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id, product) {
  if (!id) throw new Error("Product ID is required");

  return apiRequest(API_BASE, {
    method: "PUT",
    body: JSON.stringify({ id, product }),
  });
}

export async function deleteProduct(id) {
  return apiRequest(API_BASE, {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}

export async function updateProductOrder(productOrders) {
  if (!Array.isArray(productOrders) || productOrders.length === 0) {
    throw new Error("Product orders array is required");
  }

  return apiRequest(`${API_BASE}/reorder`, {
    method: "PUT",
    body: JSON.stringify(productOrders),
  });
}

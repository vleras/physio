/**
 * Local redirect that resolves a product name to the direct AVACR7 product page
 * (via Shopify suggest → /products/{handle}). Falls back to search if no match.
 */
export function avacr7ProductUrl(productName: string): string {
  const q = productName.trim();
  if (!q) return "https://avacr7.com/collections/all";
  return `/api/avacr7-product?q=${encodeURIComponent(q)}`;
}

/** @deprecated Use avacr7ProductUrl — kept as alias for older imports */
export function avacr7SearchUrl(productName: string): string {
  return avacr7ProductUrl(productName);
}

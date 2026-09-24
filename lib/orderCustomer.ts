export type OrderCustomer = {
  name: string;
  phone: string;
  fulfillment: "delivery" | "pickup";
  address: string;
};

export function validOrderCustomer(value: unknown): value is OrderCustomer {
  if (!value || typeof value !== "object") return false;
  const c = value as OrderCustomer;
  return typeof c.name === "string" && c.name.trim().length >= 2 && c.name.length <= 100 &&
    typeof c.phone === "string" && c.phone.length <= 30 && /^[+\d\s().-]+$/.test(c.phone) &&
    c.phone.replace(/\D/g, "").length >= 7 && c.phone.replace(/\D/g, "").length <= 15 &&
    (c.fulfillment === "delivery" || c.fulfillment === "pickup") &&
    typeof c.address === "string" && c.address.length <= 500 &&
    (c.fulfillment !== "delivery" || c.address.trim().length >= 5);
}

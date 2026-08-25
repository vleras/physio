/**
 * Parse free-form product price strings into EUR cents for Stripe.
 * Accepts: "997", "997 EUR", "997.50", "1,250.00", "1.250,00"
 */
export function parsePriceToCents(
  price: string | null | undefined
): number | null {
  if (!price) return null;

  const trimmed = price.trim();
  if (!trimmed) return null;
  if (/^n\/?a$/i.test(trimmed)) return null;

  const cleaned = trimmed.replace(/[^0-9.,]/g, "");
  if (!cleaned) return null;

  const hasComma = cleaned.includes(",");
  const hasDot = cleaned.includes(".");

  let normalized = cleaned;

  if (hasComma && hasDot) {
    if (cleaned.lastIndexOf(",") > cleaned.lastIndexOf(".")) {
      normalized = cleaned.replace(/\./g, "").replace(",", ".");
    } else {
      normalized = cleaned.replace(/,/g, "");
    }
  } else if (hasComma) {
    const parts = cleaned.split(",");
    if (parts.length === 2 && parts[1].length <= 2) {
      normalized = `${parts[0].replace(/\./g, "")}.${parts[1]}`;
    } else {
      normalized = cleaned.replace(/,/g, "");
    }
  } else if (hasDot) {
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      const decimal = parts.pop() as string;
      normalized =
        decimal.length <= 2
          ? `${parts.join("")}.${decimal}`
          : cleaned.replace(/\./g, "");
    }
  }

  const amount = Number.parseFloat(normalized);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  return Math.round(amount * 100);
}

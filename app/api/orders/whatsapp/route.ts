import { NextRequest, NextResponse } from "next/server";
import { getProductById, type Locale } from "@/lib/getProducts";
import { parsePriceToCents } from "@/lib/parsePrice";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.id ?? "") ||
        !Array.isArray(body.items) || !body.items.length || body.items.length > 50 ||
        (body.note != null && (typeof body.note !== "string" || body.note.length > 500))) {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }
    const locale: Locale = ["en", "sq", "mk"].includes(body.locale) ? body.locale : "en";
    const quantities = new Map<number, number>();
    for (const item of body.items) {
      if (!item || !Number.isSafeInteger(item.productId) || item.productId <= 0 ||
          !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) {
        return NextResponse.json({ error: "Invalid item" }, { status: 400 });
      }
      const quantity = (quantities.get(item.productId) ?? 0) + item.quantity;
      if (quantity > 20) return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
      quantities.set(item.productId, quantity);
    }
    const lines = [];
    for (const [id, quantity] of quantities) {
      const product = await getProductById(id, locale);
      const cents = product && parsePriceToCents(product.price);
      if (!product || cents == null || cents <= 0) {
        return NextResponse.json({ error: "Product unavailable" }, { status: 400 });
      }
      lines.push({ product_id: id, name: product.name, quantity,
        unit_amount_cents: cents, image: product.images?.[0] ?? null });
    }
    const { error } = await supabaseAdmin.from("orders").insert({
      id: body.id,
      product_id: lines[0].product_id,
      product_name: lines.length === 1 ? lines[0].name : `${lines[0].name} +${lines.length - 1}`,
      quantity: lines.reduce((sum, item) => sum + item.quantity, 0),
      amount_cents: lines.reduce((sum, item) => sum + item.quantity * item.unit_amount_cents, 0),
      currency: "eur", status: "pending", line_items: lines,
      order_note: body.note?.trim() || null,
    });
    // Repeated clicks/retries reuse the UUID; never overwrite the saved order.
    if (error && error.code !== "23505") {
      console.error("WhatsApp order save failed:", error.code);
      return NextResponse.json({ error: "Could not save order" }, { status: 503 });
    }
    return NextResponse.json({ orderId: body.id });
  } catch {
    return NextResponse.json({ error: "Could not save order" }, { status: 400 });
  }
}

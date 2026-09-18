import { NextRequest, NextResponse } from "next/server";
import { getProductById, type Locale } from "@/lib/getProducts";
import { parsePriceToCents } from "@/lib/parsePrice";
import { getSiteUrl, getStripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

type CheckoutItemInput = {
  productId?: number;
  quantity?: number;
};

type CheckoutBody = {
  productId?: number;
  quantity?: number;
  locale?: string;
  note?: string;
  items?: CheckoutItemInput[];
};

function isLocale(value: unknown): value is Locale {
  return value === "sq" || value === "en" || value === "mk";
}

function parseQuantity(value: unknown): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) return 1;
  return Math.min(n, 20);
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Payments are not configured yet." },
        { status: 503 }
      );
    }

    const body = (await request.json()) as CheckoutBody;
    const locale: Locale = isLocale(body.locale) ? body.locale : "sq";
    const note =
      typeof body.note === "string" ? body.note.trim().slice(0, 500) : "";

    const rawItems: CheckoutItemInput[] =
      Array.isArray(body.items) && body.items.length > 0
        ? body.items
        : body.productId
          ? [{ productId: body.productId, quantity: body.quantity }]
          : [];

    if (!rawItems.length) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const merged = new Map<number, number>();
    for (const item of rawItems) {
      const productId = Number(item.productId);
      if (!Number.isInteger(productId) || productId <= 0) continue;
      const qty = parseQuantity(item.quantity);
      merged.set(productId, Math.min(20, (merged.get(productId) ?? 0) + qty));
    }

    if (!merged.size) {
      return NextResponse.json({ error: "Invalid cart items." }, { status: 400 });
    }

    const lineItems: Array<{
      product_id: number;
      name: string;
      quantity: number;
      unit_amount_cents: number;
      image?: string;
    }> = [];

    for (const [productId, quantity] of merged) {
      const product = await getProductById(productId, locale);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${productId}` },
          { status: 404 }
        );
      }
      const unitAmountCents = parsePriceToCents(product.price);
      if (unitAmountCents == null) {
        return NextResponse.json(
          { error: `Invalid price for product: ${product.name}` },
          { status: 400 }
        );
      }
      lineItems.push({
        product_id: product.id,
        name: product.name,
        quantity,
        unit_amount_cents: unitAmountCents,
        image: product.images?.[0],
      });
    }

    const totalQuantity = lineItems.reduce((sum, i) => sum + i.quantity, 0);
    const totalAmountCents = lineItems.reduce(
      (sum, i) => sum + i.unit_amount_cents * i.quantity,
      0
    );
    const summaryName =
      lineItems.length === 1
        ? lineItems[0].name
        : `${lineItems[0].name} +${lineItems.length - 1}`;

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        product_id: lineItems[0].product_id,
        product_name: summaryName,
        quantity: totalQuantity,
        amount_cents: totalAmountCents,
        currency: "eur",
        status: "pending",
        line_items: lineItems.map(
          ({ product_id, name, quantity, unit_amount_cents, image }) => ({
            product_id,
            name,
            quantity,
            unit_amount_cents,
            image: image || null,
          })
        ),
        order_note: note || null,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Failed to create order:", orderError);
      const hint =
        orderError?.message?.includes("line_items") ||
        orderError?.code === "PGRST204"
          ? " Run scripts/orders_add_line_items.sql in Supabase SQL editor, then wait a few seconds (or run: NOTIFY pgrst, 'reload schema';)."
          : "";
      return NextResponse.json(
        {
          error: `Could not create order.${hint}`,
          details: orderError?.message ?? null,
        },
        { status: 500 }
      );
    }

    const siteUrl = getSiteUrl(request.url);
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "eur",
      payment_method_types: ["card", "paypal"],
      phone_number_collection: { enabled: true },
      billing_address_collection: "auto",
      custom_fields: [
        {
          key: "delivery_address",
          label: {
            type: "custom",
            custom: "Delivery address",
          },
          type: "text",
          optional: false,
        },
      ],
      ...(note
        ? {
            custom_text: {
              submit: {
                message: `Note: ${note}`,
              },
            },
          }
        : {}),
      line_items: lineItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "eur",
          unit_amount: item.unit_amount_cents,
          product_data: {
            name: item.name,
            ...(item.image ? { images: [item.image] } : {}),
          },
        },
      })),
      metadata: {
        order_id: order.id,
        product_id: String(lineItems[0].product_id),
        quantity: String(totalQuantity),
        item_count: String(lineItems.length),
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
    });

    await supabaseAdmin
      .from("orders")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", order.id);

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url, orderId: order.id });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Checkout failed. Please try again." },
      { status: 500 }
    );
  }
}

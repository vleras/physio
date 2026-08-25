import { NextRequest, NextResponse } from "next/server";
import { getProductById, type Locale } from "@/lib/getProducts";
import { parsePriceToCents } from "@/lib/parsePrice";
import { getSiteUrl, getStripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

type CheckoutBody = {
  productId?: number;
  locale?: string;
};

function isLocale(value: unknown): value is Locale {
  return value === "sq" || value === "en" || value === "mk";
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
    const productId = Number(body.productId);
    const locale: Locale = isLocale(body.locale) ? body.locale : "sq";

    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json({ error: "Invalid product." }, { status: 400 });
    }

    const product = await getProductById(productId, locale);
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const amountCents = parsePriceToCents(product.price);
    if (amountCents == null) {
      return NextResponse.json(
        {
          error:
            "This product does not have a valid price for checkout. Use a numeric EUR price (e.g. 997 or 997.00).",
        },
        { status: 400 }
      );
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        product_id: product.id,
        product_name: product.name,
        amount_cents: amountCents,
        currency: "eur",
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Failed to create order:", orderError);
      return NextResponse.json(
        { error: "Could not create order." },
        { status: 500 }
      );
    }

    const siteUrl = getSiteUrl(request.url);
    const stripe = getStripe();
    const image =
      product.images?.find((src) => typeof src === "string" && src.length > 0) ??
      undefined;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "eur",
      customer_email: undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: amountCents,
            product_data: {
              name: product.name,
              ...(image ? { images: [image] } : {}),
            },
          },
        },
      ],
      metadata: {
        order_id: order.id,
        product_id: String(product.id),
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel?product_id=${product.id}`,
    });

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", order.id);

    if (updateError) {
      console.error("Failed to attach Stripe session to order:", updateError);
    }

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

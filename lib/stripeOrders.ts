import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type ShippingDetails = {
  name?: string | null;
  phone?: string | null;
  address?: Stripe.Address | null;
};

function getShippingDetails(
  session: Stripe.Checkout.Session
): ShippingDetails | null {
  const collected = session.collected_information?.shipping_details;
  if (collected) return collected;

  const legacy = (
    session as Stripe.Checkout.Session & {
      shipping_details?: ShippingDetails | null;
    }
  ).shipping_details;

  return legacy ?? null;
}

function getCustomFieldText(
  session: Stripe.Checkout.Session,
  key: string
): string | null {
  const field = session.custom_fields?.find((item) => item.key === key);
  const value = field?.text?.value?.trim();
  return value || null;
}

export function orderFieldsFromCheckoutSession(session: Stripe.Checkout.Session) {
  const shipping = getShippingDetails(session);
  const addr = shipping?.address ?? null;
  const deliveryAddress = getCustomFieldText(session, "delivery_address");
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  const status =
    session.payment_status === "paid"
      ? "paid"
      : session.status === "expired"
        ? "expired"
        : "pending";

  const quantity = Number(session.metadata?.quantity);

  return {
    status,
    customer_email: session.customer_details?.email ?? session.customer_email,
    customer_name: session.customer_details?.name ?? shipping?.name ?? null,
    customer_phone:
      session.customer_details?.phone ?? shipping?.phone ?? null,
    shipping_name: shipping?.name ?? session.customer_details?.name ?? null,
    // Prefer the single delivery-address field; fall back to Stripe shipping form
    shipping_line1: deliveryAddress ?? addr?.line1 ?? null,
    shipping_line2: deliveryAddress ? null : addr?.line2 ?? null,
    shipping_city: deliveryAddress ? null : addr?.city ?? null,
    shipping_state: deliveryAddress ? null : addr?.state ?? null,
    shipping_postal_code: deliveryAddress ? null : addr?.postal_code ?? null,
    shipping_country: deliveryAddress ? null : addr?.country ?? null,
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id: paymentIntentId,
    ...(Number.isInteger(quantity) && quantity > 0 ? { quantity } : {}),
  };
}

export async function syncOrderFromCheckoutSession(
  session: Stripe.Checkout.Session
) {
  const orderId = session.metadata?.order_id;
  const fields = orderFieldsFromCheckoutSession(session);

  if (orderId) {
    const { error } = await supabaseAdmin
      .from("orders")
      .update(fields)
      .eq("id", orderId);
    if (error) {
      console.error("Failed to sync order by id:", error);
    }
    return;
  }

  if (session.id) {
    const { error } = await supabaseAdmin
      .from("orders")
      .update(fields)
      .eq("stripe_checkout_session_id", session.id);
    if (error) {
      console.error("Failed to sync order by session id:", error);
    }
  }
}

/** Pull latest status from Stripe for pending checkout sessions. */
export async function syncPendingOrdersFromStripe(limit = 50) {
  if (!process.env.STRIPE_SECRET_KEY) return 0;

  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("id, stripe_checkout_session_id")
    .eq("status", "pending")
    .not("stripe_checkout_session_id", "is", null)
    .limit(limit);

  if (error || !orders?.length) return 0;

  const stripe = getStripe();
  let updated = 0;

  for (const order of orders) {
    if (!order.stripe_checkout_session_id) continue;
    try {
      const session = await stripe.checkout.sessions.retrieve(
        order.stripe_checkout_session_id
      );
      const fields = orderFieldsFromCheckoutSession(session);
      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update(fields)
        .eq("id", order.id);
      if (!updateError) updated += 1;
    } catch (err) {
      console.error("Failed to sync order", order.id, err);
    }
  }

  return updated;
}

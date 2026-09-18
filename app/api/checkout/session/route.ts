import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { syncOrderFromCheckoutSession } from "@/lib/stripeOrders";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Payments are not configured yet." },
        { status: 503 }
      );
    }

    const sessionId = request.nextUrl.searchParams.get("session_id");
    if (!sessionId || !sessionId.startsWith("cs_")) {
      return NextResponse.json({ error: "Invalid session." }, { status: 400 });
    }

    const session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    if (session.status !== "complete" && session.payment_status !== "paid") {
      return NextResponse.json({ error: "Session not paid." }, { status: 404 });
    }

    // Persist paid + shipping as soon as the customer returns from Stripe
    await syncOrderFromCheckoutSession(session);

    const lineItem = session.line_items?.data?.[0];
    const amountCents = session.amount_total ?? lineItem?.amount_total ?? 0;
    const currency = (session.currency ?? "eur").toUpperCase();
    const productName =
      lineItem?.description ??
      lineItem?.price?.product?.toString() ??
      null;

    return NextResponse.json({
      amountCents,
      currency,
      productName,
      customerEmail: session.customer_details?.email ?? null,
    });
  } catch (error) {
    console.error("Checkout session lookup failed:", error);
    return NextResponse.json(
      { error: "Could not load session." },
      { status: 500 }
    );
  }
}

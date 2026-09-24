import { NextRequest, NextResponse } from "next/server";
import { verifySession, ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";
import { syncPendingOrdersFromStripe } from "@/lib/stripeOrders";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type OrderLineItem = {
  product_id?: number;
  name?: string;
  quantity?: number;
  unit_amount_cents?: number;
  image?: string | null;
};

async function requireAuth(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

async function productImageMap(productIds: number[]) {
  const uniqueIds = [...new Set(productIds.filter((id) => Number.isInteger(id) && id > 0))];
  if (!uniqueIds.length) return new Map<number, string>();

  const { data, error } = await supabaseAdmin
    .from("Products")
    .select("id, images")
    .in("id", uniqueIds);

  if (error) {
    console.error("Failed to load product images for orders:", error);
    return new Map<number, string>();
  }

  const map = new Map<number, string>();
  for (const product of data ?? []) {
    const image = Array.isArray(product.images) ? product.images[0] : null;
    if (typeof image === "string" && image) {
      map.set(product.id, image);
    }
  }
  return map;
}

function collectProductIds(order: {
  product_id?: number;
  line_items?: OrderLineItem[] | null;
}) {
  const ids: number[] = [];
  if (typeof order.product_id === "number") ids.push(order.product_id);
  if (Array.isArray(order.line_items)) {
    for (const item of order.line_items) {
      if (typeof item?.product_id === "number") ids.push(item.product_id);
    }
  }
  return ids;
}

function withProductImages<T extends {
  product_id?: number;
  line_items?: OrderLineItem[] | null;
}>(order: T, images: Map<number, string>): T {
  const lineItems = Array.isArray(order.line_items)
    ? order.line_items.map((item) => ({
        ...item,
        image:
          item.image ||
          (typeof item.product_id === "number"
            ? images.get(item.product_id) ?? null
            : null),
      }))
    : order.line_items;

  // If there are no line_items, keep a top-level image for the fallback UI
  const fallbackImage =
    typeof order.product_id === "number"
      ? images.get(order.product_id) ?? null
      : null;

  return {
    ...order,
    line_items: lineItems,
    product_image: fallbackImage,
  };
}

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  // Keep paid list current without manual refresh buttons
  try {
    await syncPendingOrdersFromStripe();
  } catch (error) {
    console.error("Auto-sync pending orders failed:", error);
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", id)
      .in("status", ["paid", "pending"])
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const images = await productImageMap(collectProductIds(data));
    return NextResponse.json(withProductImages(data, images));
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .in("status", ["paid", "pending"])
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const orders = data ?? [];
  const images = await productImageMap(orders.flatMap(collectProductIds));
  return NextResponse.json(orders.map((order) => withProductImages(order, images)));
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }
  const { error } = await supabaseAdmin.from("orders").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Could not delete order" }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  const body = await request.json().catch(() => null);
  const id = body?.id;
  const status = body?.status;
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id) || !["pending", "paid"].includes(status)) {
    return NextResponse.json({ error: "Invalid order update" }, { status: 400 });
  }
  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();
  if (error || !data) return NextResponse.json({ error: "Could not update order" }, { status: 500 });
  return NextResponse.json(data);
}

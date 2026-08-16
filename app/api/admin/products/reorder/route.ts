import { NextRequest, NextResponse } from "next/server";
import { verifySession, ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PUT(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const productOrders = await request.json();

  if (!Array.isArray(productOrders) || productOrders.length === 0) {
    return NextResponse.json({ error: "Product orders array is required" }, { status: 400 });
  }

  const updates = productOrders.map(({ id, display_order }: { id: number; display_order: number }) =>
    supabaseAdmin.from("Products").update({ display_order }).eq("id", id)
  );

  const results = await Promise.all(updates);
  const errors = results.filter((result) => result.error);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors[0].error!.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

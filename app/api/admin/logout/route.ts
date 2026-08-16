import { NextResponse } from "next/server";
import { destroySession, ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";

export async function POST() {
  try {
    await destroySession();

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}

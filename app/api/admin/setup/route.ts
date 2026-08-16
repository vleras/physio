import { NextRequest, NextResponse } from "next/server";
import { updatePassword } from "@/lib/adminAuth";

/** Sets/resets the admin password. Default: admin123 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const pwd =
      typeof body.password === "string" && body.password.length > 0
        ? body.password
        : "admin123";

    await updatePassword(pwd);

    return NextResponse.json({
      success: true,
      message: `Admin password set to "${pwd}".`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

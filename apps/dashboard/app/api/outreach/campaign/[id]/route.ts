import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const NODE_BACKEND = process.env.NODE_BACKEND_URL || "https://autoapply-backend-wkqq.onrender.com";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const rawToken = req.headers.get("authorization")?.replace("Bearer ", "") || cookieStore.get("token")?.value || "";
    const token = rawToken ? `Bearer ${rawToken}` : "";
    const res = await fetch(`${NODE_BACKEND}/api/outreach/campaigns/${id}`, {
      headers: { Authorization: token },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch campaign status" }, { status: 500 });
  }
}

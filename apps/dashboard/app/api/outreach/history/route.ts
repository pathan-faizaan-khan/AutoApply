import { NextRequest, NextResponse } from "next/server";

const NODE_BACKEND = process.env.NODE_BACKEND_URL || "https://autoapply-backend-wkqq.onrender.com";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization") || "";
    const res = await fetch(`${NODE_BACKEND}/api/outreach/history`, {
      headers: { Authorization: token },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch outreach history" }, { status: 500 });
  }
}

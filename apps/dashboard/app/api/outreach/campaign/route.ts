import { NextRequest, NextResponse } from "next/server";

const NODE_BACKEND = process.env.NODE_BACKEND_URL || "https://autoapply-backend-wkqq.onrender.com";

// GET /api/outreach/campaign → list campaigns
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization") || "";
    const res = await fetch(`${NODE_BACKEND}/api/outreach/campaigns`, {
      headers: { Authorization: token },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

// POST /api/outreach/campaign → create new campaign from wizard
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization") || "";
    const body = await req.json();
    const res = await fetch(`${NODE_BACKEND}/api/outreach/campaigns`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}

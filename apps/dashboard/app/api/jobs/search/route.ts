import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const FASTAPI_URL = process.env.FASTAPI_URL || "https://autoapply-scraper-backend.onrender.com";
const NODE_BACKEND = process.env.NODE_BACKEND_URL || "https://autoapply-backend-wkqq.onrender.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || cookieStore.get("token")?.value || "";
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${NODE_BACKEND}/api/jobs/google-search`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: "Job search failed" }, { status: 500 });
  }
}

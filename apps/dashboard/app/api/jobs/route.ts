import { NextResponse } from "next/server";

const NODE_BACKEND = process.env.NODE_BACKEND_URL || "https://autoapply-backend-wkqq.onrender.com";

export async function GET() {
  try {
    const res = await fetch(`${NODE_BACKEND}/api/jobs`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // Important to skip caching for real-time DB queries in Next.js App Router
      cache: "no-store", 
    });
    
    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[api/jobs GET]", err);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

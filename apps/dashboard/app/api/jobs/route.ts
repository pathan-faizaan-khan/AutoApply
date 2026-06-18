import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const NODE_BACKEND = process.env.NODE_BACKEND_URL || "https://autoapply-backend-wkqq.onrender.com";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || cookieStore.get("token")?.value || "";
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${NODE_BACKEND}/api/jobs`, {
      method: "GET",
      headers,
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

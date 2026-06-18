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

    const res = await fetch(`${NODE_BACKEND}/api/outreach/resume-context`, {
      method: "GET",
      headers,
    });
    
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Backend returned ${res.status}`, details: text }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[api/outreach/resume-context GET]", err);
    return NextResponse.json({ error: "Failed to fetch resume context" }, { status: 500 });
  }
}

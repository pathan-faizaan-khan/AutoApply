import { NextResponse } from "next/server";

const NODE_BACKEND = process.env.NODE_BACKEND_URL || "https://autoapply-backend-wkqq.onrender.com";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await fetch(`${NODE_BACKEND}/api/profile`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        ...authHeader
      },
      cache: "no-store",
    });
    
    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[api/profile GET]", err);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
    const body = await req.json();

    const res = await fetch(`${NODE_BACKEND}/api/profile`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        ...authHeader
      },
      body: JSON.stringify(body)
    });
    
    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[api/profile PUT]", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

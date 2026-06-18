import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const FASTAPI_URL = process.env.FASTAPI_URL || "https://autoapply-scraper-backend.onrender.com";
const NODE_BACKEND = process.env.NODE_BACKEND_URL || "https://autoapply-backend-wkqq.onrender.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const rawToken = req.headers.get("authorization")?.replace("Bearer ", "") || cookieStore.get("token")?.value || "";
    const token = rawToken ? `Bearer ${rawToken}` : "";
    const { target_id, ...emailPayload } = body;

    // 1. Generate email via FastAPI + Groq
    const genRes = await fetch(`${FASTAPI_URL}/api/email/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailPayload),
    });
    const { subject, body: emailBody } = await genRes.json();

    // 2. Save draft to DB via Node backend
    const saveRes = await fetch(`${NODE_BACKEND}/api/outreach/emails`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({ targetId: target_id, subject, body: emailBody }),
    });
    const saved = await saveRes.json();

    return NextResponse.json({ email: saved.email, subject, body: emailBody });
  } catch (err) {
    return NextResponse.json({ error: "Email generation failed" }, { status: 500 });
  }
}

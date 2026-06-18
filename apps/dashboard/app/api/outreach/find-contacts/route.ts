import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const FASTAPI_URL = process.env.FASTAPI_URL || "https://autoapply-scraper-backend.onrender.com";
const NODE_BACKEND = process.env.NODE_BACKEND_URL || "https://autoapply-backend-wkqq.onrender.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company_name, domain, target_role, campaign_id } = body;

    const cookieStore = await cookies();
    const rawToken = req.headers.get("authorization")?.replace("Bearer ", "") || cookieStore.get("token")?.value || "";
    const token = rawToken ? `Bearer ${rawToken}` : "";

    // Call FastAPI multi-layer contact discovery
    const fastapiRes = await fetch(`${FASTAPI_URL}/api/jobs/find-contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_name, domain, target_role }),
    });

    const { contacts } = await fastapiRes.json();

    // If we have contacts + a campaign_id, save the best contact to DB
    if (contacts?.length && campaign_id) {
      const best = contacts[0];
      await fetch(`${NODE_BACKEND}/api/outreach/targets/${body.target_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({
          contactName: best.name,
          contactEmail: best.email,
          contactLinkedin: best.linkedin_url || null,
          contactGithub: best.github_url || null,
          contactConfidence: best.confidence,
        }),
      });
    }

    return NextResponse.json({ contacts });
  } catch (err) {
    return NextResponse.json({ error: "Contact discovery failed" }, { status: 500 });
  }
}

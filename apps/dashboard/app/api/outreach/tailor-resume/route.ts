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

    // 1. Fetch latest resume from Node backend for context
    const resumeRes = await fetch(`${NODE_BACKEND}/api/outreach/resume-context`, {
      headers: { Authorization: token },
    });
    const resumeContext = await resumeRes.json();

    // 2. Call FastAPI resume tailor
    const tailorRes = await fetch(`${FASTAPI_URL}/api/resume/tailor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job_title: body.job_title,
        job_description: body.job_description,
        resume_data: resumeContext,
        candidate_name: resumeContext?.personalInfo?.name || "Candidate",
      }),
    });
    const { tailored_resume, changes } = await tailorRes.json();

    // 3. Save tailored resume JSON to the cold email record
    if (body.email_id) {
      await fetch(`${NODE_BACKEND}/api/outreach/emails/${body.email_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ tailoredResumeJson: JSON.stringify(tailored_resume) }),
      });
    }

    return NextResponse.json({ tailored_resume, changes });
  } catch (err) {
    return NextResponse.json({ error: "Resume tailoring failed" }, { status: 500 });
  }
}

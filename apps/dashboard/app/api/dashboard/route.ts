import { NextRequest, NextResponse } from "next/server";
import { listResumes, RESUMES_PREFIX, getResumeDownloadUrl } from "../../../lib/s3";
import { cookies } from "next/headers";

const NODE_BACKEND = process.env.NODE_BACKEND_URL || "https://autoapply-backend-wkqq.onrender.com";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = req.headers.get("authorization")?.replace("Bearer ", "") || cookieStore.get("token")?.value || "";

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Fan-out all backend calls in parallel
  const [resumeResult, jobsResult, historyResult, campaignsResult] = await Promise.allSettled([
    // 1. User's resumes
    fetch(`${NODE_BACKEND}/api/resumes`, {
      cache: "no-store",
      headers,
    }).then(async (r) => {
      if (!r.ok) return [];
      const data = await r.json();
      const userResumes = data.resumes || [];
      const items = await Promise.all(
        userResumes.map(async (resObj: any) => {
          const url = await getResumeDownloadUrl(resObj.s3Url);
          return {
            key: resObj.s3Url,
            fileName: resObj.fileName,
            size: 0,
            lastModified: resObj.createdAt,
            downloadUrl: url,
          };
        })
      );
      items.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
      return items;
    }),

    // 2. Scraped jobs
    fetch(`${NODE_BACKEND}/api/jobs`, {
      cache: "no-store",
      headers,
    }).then((r) => (r.ok ? r.json() : [])),

    // 3. Outreach history (cold emails sent)
    fetch(`${NODE_BACKEND}/api/outreach/history`, {
      cache: "no-store",
      headers,
    }).then((r) => (r.ok ? r.json() : { history: [] })),

    // 4. Outreach campaigns
    fetch(`${NODE_BACKEND}/api/outreach/campaigns`, {
      cache: "no-store",
      headers,
    }).then((r) => (r.ok ? r.json() : { campaigns: [] })),
  ]);

  // Safely extract results
  const resumes = resumeResult.status === "fulfilled" ? resumeResult.value : [];
  const rawJobs = jobsResult.status === "fulfilled" ? jobsResult.value : [];
  const jobs = Array.isArray(rawJobs) ? rawJobs : [];
  const historyData = historyResult.status === "fulfilled" ? historyResult.value : { history: [] };
  const history: any[] = historyData?.history ?? [];
  const campaignsData = campaignsResult.status === "fulfilled" ? campaignsResult.value : { campaigns: [] };
  const campaigns: any[] = campaignsData?.campaigns ?? [];

  const emailsSent = history.filter((h: any) => h?.email?.status === "sent").length;
  const emailsDraft = history.filter((h: any) => h?.email?.status === "draft").length;
  const activeCampaigns = campaigns.filter((c: any) => c.status === "active").length;

  const recentJobs = jobs.slice(0, 6).map((j: any) => ({
    id: j.id,
    title: j.title,
    companyName: j.companyName,
    location: j.location,
    jobUrl: j.jobUrl,
    createdAt: j.createdAt,
  }));

  // Latest 5 activity items from outreach history
  const recentActivity = history.slice(0, 5).map((h: any) => ({
    id: h.email?.id,
    type: h.email?.status === "sent" ? "email_sent" : "email_draft",
    company: h.target?.companyName ?? "Unknown",
    contact: h.target?.contactName ?? null,
    subject: h.email?.subject ?? "Cold email",
    sentAt: h.email?.sentAt ?? h.email?.createdAt,
  }));

  // Latest resume
  const latestResume = resumes[0] ?? null;

  return NextResponse.json({
    stats: {
      resumesUploaded: resumes.length,
      jobsAvailable: jobs.length,
      emailsSent,
      emailsDraft,
      activeCampaigns,
    },
    recentJobs,
    recentActivity,
    latestResume,
    resumes: resumes.slice(0, 3),
  });
}

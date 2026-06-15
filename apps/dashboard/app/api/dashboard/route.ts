import { NextRequest, NextResponse } from "next/server";
import { listResumes, RESUMES_PREFIX, getResumeDownloadUrl } from "../../../lib/s3";

const NODE_BACKEND = process.env.NODE_BACKEND_URL || "https://autoapply-backend-wkqq.onrender.com";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Fan-out all backend calls in parallel
  const [resumeResult, jobsResult, historyResult, campaignsResult] = await Promise.allSettled([
    // 1. S3 resume list
    listResumes().then(async (objects) => {
      const items = await Promise.all(
        objects.map(async (obj) => {
          const url = await getResumeDownloadUrl(obj.key);
          return {
            key: obj.key,
            fileName: obj.key.replace(RESUMES_PREFIX, ""),
            size: obj.size,
            lastModified: obj.lastModified.toISOString(),
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

  // Derive stats
  const emailsSent = history.filter((h: any) => h?.email?.status === "sent").length;
  const emailsDraft = history.filter((h: any) => h?.email?.status === "draft").length;
  const activeCampaigns = campaigns.filter((c: any) => c.status === "active").length;

  // Latest 5 jobs
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

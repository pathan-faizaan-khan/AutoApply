import { NextRequest, NextResponse } from "next/server";
import {
  uploadResume,
  getResumeDownloadUrl,
  deleteResume,
  listResumes,
  RESUMES_PREFIX,
} from "../../../lib/s3";

export const runtime = "nodejs";

// ── GET /api/resumes ──────────────────────────────────────────────────────────
// Returns list of stored resumes with presigned download URLs.
export async function GET() {
  try {
    const objects = await listResumes();

    const items = await Promise.all(
      objects.map(async (obj) => {
        const url = await getResumeDownloadUrl(obj.key);
        const fileName = obj.key.replace(RESUMES_PREFIX, "");
        return {
          key: obj.key,
          fileName,
          size: obj.size,
          lastModified: obj.lastModified.toISOString(),
          downloadUrl: url,
        };
      })
    );

    // newest first
    items.sort(
      (a, b) =>
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    );

    return NextResponse.json({ resumes: items });
  } catch (err: any) {
    console.error("[resumes GET]", err);
    return NextResponse.json({ error: err?.message ?? "Failed to list resumes" }, { status: 500 });
  }
}

// ── POST /api/resumes ─────────────────────────────────────────────────────────
// Accepts multipart/form-data with `file` field. Stores in S3 under resumes/.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const blob = file as Blob;
    const originalName = (file as any).name as string;
    const contentType = blob.type || "application/octet-stream";

    // Build a timestamped key: resumes/1717824000000_MyResume.pdf
    const timestamp = Date.now();
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `${RESUMES_PREFIX}${timestamp}_${safeName}`;

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await uploadResume(key, buffer, contentType);

    // Return a fresh presigned URL for immediate download
    const downloadUrl = await getResumeDownloadUrl(key);

    return NextResponse.json({
      key,
      fileName: originalName,
      size: buffer.byteLength,
      lastModified: new Date().toISOString(),
      downloadUrl,
    });
  } catch (err: any) {
    console.error("[resumes POST]", err);
    return NextResponse.json({ error: err?.message ?? "Upload failed" }, { status: 500 });
  }
}

// ── DELETE /api/resumes ───────────────────────────────────────────────────────
// Body: { key: string }
export async function DELETE(req: NextRequest) {
  try {
    const { key } = await req.json();
    if (!key || typeof key !== "string") {
      return NextResponse.json({ error: "Missing `key`" }, { status: 400 });
    }

    // Safety: only allow deleting within our resumes/ prefix
    if (!key.startsWith(RESUMES_PREFIX)) {
      return NextResponse.json({ error: "Invalid key" }, { status: 403 });
    }

    await deleteResume(key);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[resumes DELETE]", err);
    return NextResponse.json({ error: err?.message ?? "Delete failed" }, { status: 500 });
  }
}

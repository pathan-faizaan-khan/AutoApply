import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";

export const runtime = "nodejs"; // ensure this route always runs on Node.js

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await (file as Blob).arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    return NextResponse.json({ text: result.value });
  } catch (err: any) {
    console.error("[extract-docx]", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to extract DOCX" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // ensure this route always runs on Node.js

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await (file as Blob).arrayBuffer();
    
    // Bypass Webpack's module system entirely using eval.
    const nodeRequire = eval("require");
    const mammoth = nodeRequire("mammoth");
    
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

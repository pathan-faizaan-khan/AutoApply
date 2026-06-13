import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await (file as Blob).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Bypass Webpack's module system entirely using eval.
    // This forces it to use the raw Node.js require at runtime.
    const nodeRequire = eval("require");
    let pdfParse = nodeRequire("pdf-parse");
    if (typeof pdfParse !== "function" && pdfParse.default) {
      pdfParse = pdfParse.default;
    }
    const data = await pdfParse(buffer);

    return NextResponse.json({ text: data.text });
  } catch (err: any) {
    console.error("[extract-pdf]", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to extract PDF" },
      { status: 500 }
    );
  }
}

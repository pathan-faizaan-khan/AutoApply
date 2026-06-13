/**
 * extractDocxText – sends the .docx file to the server-side API route so that
 * the Node.js-only `mammoth` library never enters the browser bundle.
 */
export async function extractDocxText(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/extract-docx", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error ?? "Failed to extract DOCX text");
  }

  const { text } = await res.json();
  return text;
}

export async function extractImageText(file: File) {
  const Tesseract = await import("tesseract.js");

  const result = await Tesseract.recognize(file, "eng");

  return result.data.text;
}

export async function extractPdfText(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/extract-pdf", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error ?? "Failed to extract PDF text");
  }

  const { text } = await res.json();
  return text;
}

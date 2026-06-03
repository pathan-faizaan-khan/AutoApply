import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "No resume text provided" }, { status: 400 });
    }

    const prompt = `You are a resume parser. Extract structured data from the following resume text and return it as a JSON object.

Resume Text:
${text}

Return a JSON object with exactly this structure:
{
  "name": "Full name of the candidate",
  "email": "Email address",
  "phone": "Phone number",
  "education": ["Array of education entries as strings"],
  "skills": ["Array of skills as strings"],
  "languages": ["Array of languages as strings"],
  "experience": ["Array of experience entries as strings"],
  "projects": ["Array of project entries as strings"]
}

Rules:
1. Extract as much information as possible from the resume text.
2. If a field is not found, use an empty string for scalar fields or an empty array for array fields.
3. For education, include degree, institution, and dates if available.
4. For experience, include job title, company, dates, and key responsibilities.
5. For projects, include project name and description.
6. Return valid JSON only. No markdown, no code blocks.`;

    const result = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const responseText = result.choices[0]?.message?.content || "{}";

    let parsedResult;
    try {
      const cleaned = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      parsedResult = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Failed to parse Groq response:", responseText);
      return NextResponse.json({ result: responseText });
    }

    return NextResponse.json({ result: parsedResult });

  } catch (error: any) {
    console.error("Groq Parse Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to parse resume" },
      { status: 500 }
    );
  }
}

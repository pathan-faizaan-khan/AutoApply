import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "";
// Adam — warm, natural, confident narrator voice
const VOICE_ID = "pNInz6obpgDQGcFmaJgB";

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: "TTS not configured: missing ELEVENLABS_API_KEY" }, { status: 503 });
    }

    const { text, voiceId } = await req.json() as { text: string; voiceId?: string };

    // Default to Adam if no voice specified
    const resolvedVoiceId = voiceId || VOICE_ID;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    // Strip markdown symbols before sending to TTS
    const cleanText = text
      .replace(/#{1,6}\s?/g, "")       // headings
      .replace(/\*\*(.+?)\*\*/g, "$1") // bold
      .replace(/\*(.+?)\*/g, "$1")     // italic
      .replace(/`(.+?)`/g, "$1")       // code
      .replace(/[-*]\s/g, "")          // list bullets
      .replace(/\d+\.\s/g, "")         // numbered list
      .replace(/\n{2,}/g, ". ")        // paragraph breaks → natural pause
      .replace(/\n/g, " ")
      .trim()
      .slice(0, 2500); // ElevenLabs free tier limit

    const elRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${resolvedVoiceId}/stream`, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: "eleven_turbo_v2_5", // Fastest + highest quality neural model
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.35,
          use_speaker_boost: true,
        },
      }),
    });

    if (!elRes.ok) {
      const err = await elRes.text();
      console.error("ElevenLabs TTS error:", err);
      return NextResponse.json({ error: "TTS provider error" }, { status: 502 });
    }

    // Stream audio directly to the browser
    const audioBuffer = await elRes.arrayBuffer();
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("TTS Route Error:", error);
    return NextResponse.json({ error: error.message || "TTS failed" }, { status: 500 });
  }
}

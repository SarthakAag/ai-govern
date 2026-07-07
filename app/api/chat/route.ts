// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/gemini";

const MAX_QUESTION_LENGTH = 2000;

export async function POST(req: NextRequest) {
  try {
    if (req.headers.get("content-type") !== "application/json") {
      return NextResponse.json(
        { error: "Invalid content type. Expected application/json." },
        { status: 415 }
      );
    }

    const { question, language, simplified } = await req.json();

    if (!question?.trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    if (question.length > MAX_QUESTION_LENGTH) {
      return NextResponse.json(
        { error: `Question must be under ${MAX_QUESTION_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const readingLevel = simplified
      ? "Use very simple words suitable for a 5th-grade student."
      : "";

    const prompt = `
You are Smart Bharat AI.

Answer ONLY government-related questions.

Respond ONLY with valid JSON.

{
"title":"",
"description":"",
"steps":[""],
"documents":[""],
"eligibility":"",
"fees":"",
"processing_time":"",
"official_portal":"",
"tips":[""]
}

Rules:

- Respond in ${language}
- ${readingLevel}
- Do NOT use markdown.
- Do NOT wrap JSON inside \`\`\`.
- If fees are unknown, return "Varies".
- If portal is unknown, return "Official Government Website".

Question:
${question}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error("No response");
    }

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return NextResponse.json(JSON.parse(cleaned));
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        title: "Unable to answer",
        description: "Please try again.",
        steps: [],
        documents: [],
        eligibility: "-",
        fees: "-",
        processing_time: "-",
        official_portal: "-",
        tips: [],
      },
      { status: 200 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/gemini";

interface RequiredDocument {
  name: string;
  have_it: boolean;
}

interface ChecklistResponse {
  required_documents: RequiredDocument[];
  optional_documents: string[];
  common_mistakes: string[];
  processing_time: string;
  tips: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { service, language, have } = await req.json();

    if (!service?.trim()) {
      return NextResponse.json({ error: "Service is required" }, { status: 400 });
    }

    const prompt = `
You are Smart Bharat AI. The citizen wants to apply for: ${service}
Respond in ${language}.
${have?.length ? `The citizen already has: ${have.join(", ")}.` : ""}

Return a JSON object with:
- required_documents: array of { name, have_it (boolean, true only if it matches the citizen's list above) }
- optional_documents: array of strings
- common_mistakes: array of strings
- processing_time: string
- tips: array of strings
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            required_documents: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  have_it: { type: "boolean" },
                },
                required: ["name", "have_it"],
              },
            },
            optional_documents: { type: "array", items: { type: "string" } },
            common_mistakes: { type: "array", items: { type: "string" } },
            processing_time: { type: "string" },
            tips: { type: "array", items: { type: "string" } },
          },
          required: ["required_documents", "optional_documents", "common_mistakes", "processing_time", "tips"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");

    const json: ChecklistResponse = JSON.parse(text);

    const total = json.required_documents.length;
    const ready = json.required_documents.filter((d) => d.have_it).length;
    const readiness_score = total > 0 ? Math.round((ready / total) * 100) : 0;

    return NextResponse.json({ ...json, readiness_score });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to generate checklist." }, { status: 200 });
  }
}
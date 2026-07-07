// app/api/documents/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/gemini";

interface RequiredDocument {
  name: string;
  have_it: boolean;
}

interface ChecklistResponse {
  service: string;
  required_documents: RequiredDocument[];
  optional_documents: string[];
  common_mistakes: string[];
  processing_time: string;
  estimated_fee: string;
  official_portal: string;
  tips: string[];
  readiness_score: number;
}

const MAX_SERVICE_LENGTH = 300;

const fallback: ChecklistResponse = {
  service: "Government Service",
  required_documents: [],
  optional_documents: [],
  common_mistakes: [],
  processing_time: "Varies",
  estimated_fee: "Varies",
  official_portal: "Official Government Portal",
  tips: [],
  readiness_score: 0,
};

export async function POST(req: NextRequest) {
  try {
    if (req.headers.get("content-type") !== "application/json") {
      return NextResponse.json(
        { error: "Invalid content type. Expected application/json." },
        { status: 415 }
      );
    }

    const { service, language, have } = await req.json();

    if (!service?.trim()) {
      return NextResponse.json(
        { error: "Service is required." },
        { status: 400 }
      );
    }

    if (service.length > MAX_SERVICE_LENGTH) {
      return NextResponse.json(
        { error: `Service name must be under ${MAX_SERVICE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const prompt = `
You are Smart Bharat AI.

The citizen wants to apply for:

${service}

Respond in ${language}.

Citizen already has:

${have?.length ? have.join(", ") : "None"}

Return ONLY valid JSON.

{
  "service":"",
  "required_documents":[
    {
      "name":"",
      "have_it":true
    }
  ],
  "optional_documents":[""],
  "common_mistakes":[""],
  "processing_time":"",
  "estimated_fee":"",
  "official_portal":"",
  "tips":[""]
}

Rules:
- Return only JSON.
- If the citizen already has a document, set have_it=true.
- Keep answers concise.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            service: {
              type: "STRING",
            },

            required_documents: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  name: {
                    type: "STRING",
                  },
                  have_it: {
                    type: "BOOLEAN",
                  },
                },
                required: ["name", "have_it"],
              },
            },

            optional_documents: {
              type: "ARRAY",
              items: {
                type: "STRING",
              },
            },

            common_mistakes: {
              type: "ARRAY",
              items: {
                type: "STRING",
              },
            },

            processing_time: {
              type: "STRING",
            },

            estimated_fee: {
              type: "STRING",
            },

            official_portal: {
              type: "STRING",
            },

            tips: {
              type: "ARRAY",
              items: {
                type: "STRING",
              },
            },
          },

          required: [
            "service",
            "required_documents",
            "optional_documents",
            "common_mistakes",
            "processing_time",
            "estimated_fee",
            "official_portal",
            "tips",
          ],
        },
      },
    });

    const text = response.text;

    if (!text) {
      return NextResponse.json(fallback);
    }

    let parsed: Omit<ChecklistResponse, "readiness_score">;

    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json(fallback);
    }

    parsed.required_documents ??= [];
    parsed.optional_documents ??= [];
    parsed.common_mistakes ??= [];
    parsed.tips ??= [];

    const total = parsed.required_documents.length;
    const ready = parsed.required_documents.filter(
      (doc) => doc.have_it
    ).length;

    const readiness_score =
      total === 0 ? 0 : Math.round((ready / total) * 100);

    return NextResponse.json({
      ...parsed,
      readiness_score,
    });
  } catch (error) {
    console.error("Documents API Error:", error);
    return NextResponse.json(fallback);
  }
}
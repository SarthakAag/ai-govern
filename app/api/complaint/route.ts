import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/gemini";
import { complaintPrompt } from "@/lib/prompts";

interface ComplaintResult {
  priority: "Low" | "Medium" | "High" | "Critical";
  department: string;
  reason: string;
  sla: string;
  next_steps: string;
  citizen_summary: string;
  vulnerability_flags: string[];
  escalation_note: string;
  impact_note: string;
}

const fallback: ComplaintResult = {
  priority: "Medium",
  department: "Municipal Corporation",
  reason:
    "Unable to analyze the complaint automatically. It has been routed for manual review.",
  sla: "2–5 working days",
  next_steps:
    "Your complaint has been recorded and forwarded to the appropriate authority.",
  citizen_summary:
    "Your complaint has been submitted successfully.",
  vulnerability_flags: [],
  escalation_note: "",
  impact_note: "",
};

export async function POST(req: NextRequest) {
  try {
    const { complaint, language } = await req.json();

    if (!complaint?.trim()) {
      return NextResponse.json(
        { error: "Complaint text is required." },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: complaintPrompt(complaint, language),

      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: "OBJECT",

          properties: {
            priority: {
              type: "STRING",
              enum: ["Low", "Medium", "High", "Critical"],
            },

            department: {
              type: "STRING",
            },

            reason: {
              type: "STRING",
            },

            sla: {
              type: "STRING",
            },

            next_steps: {
              type: "STRING",
            },

            citizen_summary: {
              type: "STRING",
            },

            vulnerability_flags: {
              type: "ARRAY",
              items: {
                type: "STRING",
              },
            },

            escalation_note: {
              type: "STRING",
            },

            impact_note: {
              type: "STRING",
            },
          },

          required: [
            "priority",
            "department",
            "reason",
            "sla",
            "next_steps",
            "citizen_summary",
            "vulnerability_flags",
            "escalation_note",
            "impact_note",
          ],
        },
      },
    });

    const text = response.text;

    if (!text) {
      return NextResponse.json(fallback);
    }

    let parsed: ComplaintResult;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = fallback;
    }

    parsed.vulnerability_flags ??= [];
    parsed.escalation_note ??= "";
    parsed.impact_note ??= "";

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Complaint API Error:", error);

    return NextResponse.json(fallback);
  }
}
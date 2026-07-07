/**
 * @jest-environment node
 */

// app/api/complaint/route.test.ts
import { POST } from "./route";
import { NextRequest } from "next/server";

jest.mock("@/lib/gemini", () => ({
  ai: {
    models: {
      generateContent: jest.fn().mockRejectedValue(new Error("API failure")),
    },
  },
}));

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/complaint", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/complaint", () => {
  it("returns 400 when complaint text is missing", async () => {
    const res = await POST(makeRequest({ complaint: "", language: "English" }));
    expect(res.status).toBe(400);
  });

  it("returns the fallback shape when the AI call throws", async () => {
    const res = await POST(
      makeRequest({ complaint: "Pothole on main road", language: "English" })
    );
    const data = await res.json();

    expect(data.priority).toBe("Medium");
    expect(data.department).toBe("Municipal Corporation");
    expect(Array.isArray(data.vulnerability_flags)).toBe(true);
  });
});
// lib/storage.test.ts
import { saveComplaint, getComplaints, getTrustStats, findSimilarComplaints } from "./storage";

const baseComplaint = {
  id: 1,
  complaint: "No drinking water for 5 days",
  language: "English",
  location: "Whitefield, Bengaluru",
  priority: "Critical",
  department: "Water Supply Board",
  reason: "No water for multiple days is a critical health issue",
  sla: "24 Hours",
  next_steps: "Escalated to field officer",
  citizen_summary: "Your water issue has been marked urgent",
  vulnerability_flags: ["elderly"],
  escalation_note: "",
  impact_note: "",
};

beforeEach(() => {
  localStorage.clear();
});

describe("saveComplaint / getComplaints", () => {
  it("persists a complaint and retrieves it back", () => {
    saveComplaint(baseComplaint);
    const stored = getComplaints();

    expect(stored).toHaveLength(1);
    expect(stored[0].complaint).toBe(baseComplaint.complaint);
    expect(stored[0].department).toBe("Water Supply Board");
  });

  it("returns an empty array when nothing has been saved", () => {
    expect(getComplaints()).toEqual([]);
  });
});

describe("getTrustStats", () => {
  it("aggregates totals, departments, and flagged counts correctly", () => {
    const complaints = [
      baseComplaint,
      { ...baseComplaint, id: 2, department: "Roads Department", priority: "High", vulnerability_flags: [] },
      { ...baseComplaint, id: 3, department: "Water Supply Board", priority: "Medium", vulnerability_flags: [] },
    ];

    const stats = getTrustStats(complaints);

    expect(stats.total).toBe(3);
    expect(stats.departments).toBe(2); // Water Supply Board + Roads Department
    expect(stats.flagged).toBe(1); // only baseComplaint has a flag
    expect(stats.byPriority["Critical"]).toBe(1);
  });

  it("returns null for an empty complaint list", () => {
    const stats = getTrustStats([]);
    expect(stats).toBeNull();
  });
});

describe("findSimilarComplaints", () => {
  it("finds a complaint with matching location and overlapping text", () => {
    const existing = [baseComplaint];
    const similar = findSimilarComplaints(
      existing,
      "Water shortage for many days",
      "Whitefield, Bengaluru"
    );

    expect(similar.length).toBeGreaterThan(0);
  });

  it("returns no matches for an unrelated complaint and location", () => {
    const existing = [baseComplaint];
    const similar = findSimilarComplaints(
      existing,
      "Streetlight not working",
      "Andheri, Mumbai"
    );

    expect(similar).toHaveLength(0);
  });
});
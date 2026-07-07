export interface StoredComplaint {
  id: number;
  complaint: string;
  language: string;
  location?: string;
  priority: string;
  department: string;
  reason: string;
  sla: string;
  next_steps: string;
  citizen_summary: string;
  vulnerability_flags?: string[];
  escalation_note?: string;
  impact_note?: string;
}

export function saveComplaint(data: StoredComplaint) {
  const complaints = getComplaints();
  complaints.push(data);
  localStorage.setItem("complaints", JSON.stringify(complaints));
}

export function getComplaints(): StoredComplaint[] {
  return JSON.parse(localStorage.getItem("complaints") || "[]");
}

export function getTrustStats(complaints: StoredComplaint[]) {
  const total = complaints.length;
  if (total === 0) return null;

  const byPriority = complaints.reduce((acc, c) => {
    acc[c.priority] = (acc[c.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const flagged = complaints.filter(
    (c) => c.vulnerability_flags && c.vulnerability_flags.length > 0
  ).length;

  const departments = new Set(complaints.map((c) => c.department)).size;

  return { total, byPriority, flagged, departments };
}

export function findSimilarComplaints(
  complaints: StoredComplaint[],
  newComplaint: string,
  newLocation: string
): StoredComplaint[] {
  const normalize = (s: string) => s.toLowerCase().trim();
  const newWords = new Set(normalize(newComplaint).split(/\s+/));

  return complaints.filter((c) => {
    if (!newLocation || normalize(c.location || "") !== normalize(newLocation)) {
      return false;
    }
    const existingWords = new Set(normalize(c.complaint).split(/\s+/));
    const overlap = [...newWords].filter((w) => existingWords.has(w)).length;
    const similarity = overlap / Math.max(newWords.size, 1);
    return similarity > 0.4;
  });
}
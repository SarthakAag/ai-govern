// app/complaint/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { saveComplaint, getComplaints, findSimilarComplaints } from "@/lib/storage";
import { useSpeechInput } from "@/lib/useSpeechInput";

interface ComplaintResult {
  priority: string;
  department: string;
  reason: string;
  sla: string;
  next_steps: string;
  citizen_summary: string;
  vulnerability_flags: string[];
  escalation_note: string;
  impact_note: string;
}

const priorityStyles: Record<string, { dot: string; text: string; ring: string }> = {
  critical: { dot: "bg-red-500", text: "text-red-400", ring: "ring-red-500/20" },
  high: { dot: "bg-orange-500", text: "text-orange-400", ring: "ring-orange-500/20" },
  medium: { dot: "bg-yellow-500", text: "text-yellow-400", ring: "ring-yellow-500/20" },
  low: { dot: "bg-green-500", text: "text-green-400", ring: "ring-green-500/20" },
};

const langCodeMap: Record<string, string> = {
  English: "en-IN",
  Hindi: "hi-IN",
  Tamil: "ta-IN",
  Telugu: "te-IN",
  Bengali: "bn-IN",
};

function useGeolocation() {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  const detect = (onResult: (text: string) => void) => {
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported on this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          if (!res.ok) throw new Error("Reverse geocoding failed");
          const data = await res.json();
          onResult(data.display_name || `${latitude}, ${longitude}`);
        } catch {
          onResult(`${pos.coords.latitude}, ${pos.coords.longitude}`);
        } finally {
          setLocating(false);
        }
      },
      () => {
        setError("Unable to detect location. Please enter it manually.");
        setLocating(false);
      }
    );
  };

  return { detect, locating, error };
}

export default function ComplaintPage() {
  const [complaint, setComplaint] = useState("");
  const [language, setLanguage] = useState("English");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComplaintResult | null>(null);
  const [error, setError] = useState("");

  const { detect: detectLocation, locating, error: geoError } = useGeolocation();
  const { toggle: toggleVoice, listening } = useSpeechInput((text) =>
    setComplaint((prev) => (prev ? prev + " " + text : text))
  );

  const templates = [
    "There has been no drinking water in our area for 5 days.",
    "A large pothole is causing accidents on the main road.",
    "Street lights are not working for the last 3 nights.",
    "Garbage has not been collected for over a week.",
  ];

  const getPriorityStyle = (priority: string) =>
    priorityStyles[priority.toLowerCase()] ?? priorityStyles.low;

  async function analyzeComplaint() {
    setError("");

    if (!complaint.trim()) {
      setError("Please enter a complaint before submitting.");
      return;
    }

    const existing = getComplaints();
    const similar = findSimilarComplaints(existing, complaint, location);

    if (similar.length > 0) {
      const confirmed = confirm(
        `${similar.length} similar complaint(s) already reported near this location. Submit anyway?`
      );
      if (!confirmed) return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complaint, language, location }),
      });

      if (!response.ok) throw new Error("Failed to analyze complaint");

      const data: ComplaintResult = await response.json();

      // Defensive defaults in case an older cached shape slips through
      const safeData: ComplaintResult = {
        ...data,
        vulnerability_flags: data.vulnerability_flags ?? [],
        escalation_note: data.escalation_note ?? "",
        impact_note: data.impact_note ?? "",
      };

      setResult(safeData);

      saveComplaint({
        id: Date.now(),
        complaint,
        language,
        location,
        ...safeData,
      });
    } catch (err) {
      console.error(err);
      setError("Unable to analyze complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0e17] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-6 sm:mb-8"
        >
          ← Back to home
        </Link>

        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-slate-400 mb-3">
            Report an issue
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
            AI Complaint Trust Engine
          </h1>
          <div className="mt-4 h-[3px] w-20 rounded-full bg-gradient-to-r from-orange-400 via-white/40 to-green-500" />
          <p className="text-slate-400 mt-4 max-w-lg text-sm sm:text-base">
            Describe the issue and AI will detect the department, urgency and
            expected timeline — and explain its reasoning.
          </p>
        </div>

        {/* Templates */}
        <div className="grid sm:grid-cols-2 gap-3 mb-6 sm:mb-8">
          {templates.map((item) => (
            <button
              key={item}
              onClick={() => setComplaint(item)}
              disabled={loading}
              className="text-left rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300
              hover:border-orange-400/40 hover:bg-white/[0.05] transition-colors disabled:opacity-50"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-7 space-y-6">

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-500 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg bg-white/[0.04] border border-white/10 p-3 text-sm
                focus:outline-none focus:border-orange-400/50 transition-colors disabled:opacity-50"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Telugu</option>
                <option>Bengali</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-500 mb-2">
                Location
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Whitefield, Bengaluru"
                  disabled={loading}
                  className="flex-1 min-w-0 rounded-lg bg-white/[0.04] border border-white/10 p-3 text-sm
                  placeholder:text-slate-600 focus:outline-none focus:border-orange-400/50 transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => detectLocation(setLocation)}
                  disabled={locating || loading}
                  className="shrink-0 rounded-lg border border-white/10 hover:border-orange-400/40 px-3 text-xs text-slate-300 transition-colors disabled:opacity-50"
                >
                  {locating ? "📍..." : "📍 Detect"}
                </button>
              </div>
              {geoError && (
                <p className="text-xs text-red-400 mt-1.5">{geoError}</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs uppercase tracking-wide text-slate-500">
                Complaint
              </label>
              <button
                type="button"
                onClick={() => toggleVoice(langCodeMap[language])}
                disabled={loading}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors disabled:opacity-50 ${
                  listening
                    ? "border-red-400/50 text-red-400 bg-red-500/10"
                    : "border-white/10 text-slate-400 hover:border-orange-400/40"
                }`}
              >
                {listening ? "🔴 Listening..." : "🎤 Speak"}
              </button>
            </div>
            <textarea
              rows={6}
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder="Describe the issue..."
              disabled={loading}
              className="w-full rounded-lg bg-white/[0.04] border border-white/10 p-4 text-sm resize-none
              placeholder:text-slate-600 focus:outline-none focus:border-orange-400/50 transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-500 mb-2">
              Upload image <span className="text-slate-600 normal-case">(optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              disabled={loading}
              className="block w-full text-sm text-slate-400 rounded-lg border border-white/10 bg-white/[0.04] p-3
              file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-white/10 file:text-slate-300 file:text-xs disabled:opacity-50"
            />
            <p className="text-xs text-slate-600 mt-2">
              Vision AI support can be added later.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            onClick={analyzeComplaint}
            disabled={loading}
            className="w-full sm:w-auto rounded-lg bg-orange-500 px-8 py-3 font-medium text-sm
            hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500 transition-colors"
          >
            {loading ? "🧠 AI is analyzing..." : "Analyze complaint"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-7">

            <div className="flex justify-between items-start flex-wrap gap-3">
              <h2 className="text-base sm:text-lg font-medium">AI Trust Report</h2>
              <span
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                bg-white/5 ring-1 ${getPriorityStyle(result.priority).ring} ${getPriorityStyle(result.priority).text}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${getPriorityStyle(result.priority).dot}`} />
                {result.priority}
              </span>
            </div>

            {result.vulnerability_flags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {result.vulnerability_flags.map((flag) => (
                  <span
                    key={flag}
                    className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20"
                  >
                    ⚠ {flag}
                  </span>
                ))}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-6 pt-6 border-t border-white/5">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1.5">
                  Department
                </p>
                <p className="text-sm">{result.department}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1.5">
                  Expected SLA
                </p>
                <p className="text-sm">{result.sla}</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-orange-500/[0.04] border border-orange-500/10 p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-orange-400/80">
                <span>🤖</span> AI reasoning
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">Why this priority</p>
                <p className="text-sm text-slate-300">{result.reason}</p>
              </div>

              {result.escalation_note && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Priority adjustment</p>
                  <p className="text-sm text-slate-300">{result.escalation_note}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-slate-500 mb-1">Next steps</p>
                <p className="text-sm text-slate-300">{result.next_steps}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">In plain language</p>
                <p className="text-sm text-slate-300">{result.citizen_summary}</p>
              </div>

              {result.impact_note && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Why this matters</p>
                  <p className="text-sm text-slate-400 italic">{result.impact_note}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-7">
              <Link
                href="/tracker"
                className="text-center rounded-lg bg-orange-500 hover:bg-orange-600 transition-colors px-6 py-2.5 text-sm font-medium"
              >
                View trust dashboard
              </Link>

              <button
                onClick={() => {
                  setComplaint("");
                  setResult(null);
                  setError("");
                }}
                className="rounded-lg border border-white/10 hover:border-white/20 transition-colors px-6 py-2.5 text-sm"
              >
                New complaint
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
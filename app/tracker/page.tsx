"use client";

import { useState } from "react";
import Link from "next/link";
import { StoredComplaint, getComplaints, getTrustStats } from "@/lib/storage";

const priorityStyles: Record<string, { dot: string; text: string; ring: string }> = {
  critical: { dot: "bg-red-500", text: "text-red-400", ring: "ring-red-500/20" },
  high: { dot: "bg-orange-500", text: "text-orange-400", ring: "ring-orange-500/20" },
  medium: { dot: "bg-yellow-500", text: "text-yellow-400", ring: "ring-yellow-500/20" },
  low: { dot: "bg-green-500", text: "text-green-400", ring: "ring-green-500/20" },
};

const timelineSteps = [
  { label: "Complaint submitted", done: true },
  { label: "AI analysis completed", done: true },
  { label: "Department assigned", done: true },
  { label: "Field officer review", done: false, current: true },
  { label: "Resolution", done: false },
];

function loadComplaints(): StoredComplaint[] {
  if (typeof window === "undefined") return [];
  try {
    return getComplaints().reverse();
  } catch {
    return [];
  }
}

export default function TrackerPage() {
  const [complaints] = useState<StoredComplaint[]>(loadComplaints);
  const stats = getTrustStats(complaints);

  const getPriorityStyle = (priority: string) =>
    priorityStyles[priority.toLowerCase()] ?? priorityStyles.low;

  return (
    <main className="min-h-screen bg-[#0a0e17] text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-8"
        >
          ← Back to home
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-slate-400 mb-3">
            Transparency, not just a status
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Trust Dashboard
          </h1>
          <div className="mt-4 h-[3px] w-20 rounded-full bg-gradient-to-r from-orange-400 via-white/40 to-green-500" />
          <p className="text-slate-400 mt-4 max-w-lg">
            Every complaint here shows not just what happens, but why — the AI
            reasoning is visible at every step.
          </p>
        </div>

        {/* Aggregate stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-2xl font-semibold">{stats.total}</p>
              <p className="text-xs text-slate-500 mt-1">Total complaints</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-2xl font-semibold">{stats.departments}</p>
              <p className="text-xs text-slate-500 mt-1">Departments involved</p>
            </div>
            <div className="rounded-xl border border-orange-500/20 bg-orange-500/[0.04] p-4">
              <p className="text-2xl font-semibold text-orange-400">
                {stats.byPriority["Critical"] || 0}
              </p>
              <p className="text-xs text-slate-500 mt-1">Critical priority</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-2xl font-semibold">{stats.flagged}</p>
              <p className="text-xs text-slate-500 mt-1">Vulnerability-flagged</p>
            </div>
          </div>
        )}

        {complaints.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] py-16 text-center">
            <p className="text-slate-400">No complaints submitted yet.</p>
            <Link
              href="/complaint"
              className="inline-block mt-4 text-sm text-orange-400 hover:text-orange-300 transition-colors"
            >
              Report an issue →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {complaints.map((item) => {
              const style = getPriorityStyle(item.priority);
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-7"
                >
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div>
                      <h2 className="text-lg font-medium">
                        Complaint #{item.id}
                      </h2>
                      <p className="text-sm text-slate-400 mt-0.5">
                        {item.department}
                        {item.location ? ` · ${item.location}` : ""}
                      </p>
                    </div>

                    <span
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                      bg-white/5 ring-1 ${style.ring} ${style.text}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                      {item.priority}
                    </span>
                  </div>

                  {item.vulnerability_flags && item.vulnerability_flags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {item.vulnerability_flags.map((flag) => (
                        <span
                          key={flag}
                          className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20"
                        >
                          ⚠ {flag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="mt-5 text-sm text-slate-300 leading-relaxed border-l-2 border-white/10 pl-4">
                    {item.complaint}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/5">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-1.5">
                        Expected resolution
                      </p>
                      <p className="text-sm">{item.sla}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-1.5">
                        Current status
                      </p>
                      <p className="text-sm text-green-400">Assigned to department</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl bg-orange-500/[0.04] border border-orange-500/10 p-5 space-y-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-orange-400/80">
                      <span>🤖</span> AI reasoning
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">Why this routing</p>
                      <p className="text-sm text-slate-300">{item.reason}</p>
                    </div>

                    {item.escalation_note && (
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Priority adjustment</p>
                        <p className="text-sm text-slate-300">{item.escalation_note}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-slate-500 mb-1">Next steps</p>
                      <p className="text-sm text-slate-300">{item.next_steps}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">In plain language</p>
                      <p className="text-sm text-slate-300">{item.citizen_summary}</p>
                    </div>

                    {item.impact_note && (
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Why this matters</p>
                        <p className="text-sm text-slate-400 italic">{item.impact_note}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/5">
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-4">
                      Timeline
                    </p>
                    <div className="space-y-0">
                      {timelineSteps.map((step, i) => (
                        <div key={step.label} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div
                              className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                                step.done
                                  ? "bg-green-500"
                                  : step.current
                                  ? "bg-orange-400"
                                  : "bg-slate-700"
                              }`}
                            />
                            {i < timelineSteps.length - 1 && (
                              <div
                                className={`w-px flex-1 min-h-[20px] ${
                                  step.done ? "bg-green-500/30" : "bg-slate-700"
                                }`}
                              />
                            )}
                          </div>
                          <p
                            className={`text-sm pb-5 ${
                              step.done
                                ? "text-slate-300"
                                : step.current
                                ? "text-orange-300"
                                : "text-slate-600"
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
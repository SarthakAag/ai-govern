// app/documents/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

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

export default function DocumentPage() {
  const [service, setService] = useState("");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ChecklistResponse | null>(null);
  const [error, setError] = useState("");
  const [haveDocs, setHaveDocs] = useState<Set<string>>(new Set());

  async function generateChecklist() {
    if (!service.trim()) {
      setError("Please enter a government service.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          language,
          have: Array.from(haveDocs),
        }),
      });

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const data: ChecklistResponse = await res.json();

      setResult({
        ...data,
        required_documents: data.required_documents ?? [],
        optional_documents: data.optional_documents ?? [],
        common_mistakes: data.common_mistakes ?? [],
        tips: data.tips ?? [],
      });
    } catch (err) {
      console.error(err);
      setError("Unable to generate checklist. Please try again.");
    }

    setLoading(false);
  }

  function toggleHaveDoc(name: string) {
    setHaveDocs((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  const services = [
    "Passport",
    "Aadhaar Card",
    "PAN Card",
    "Driving Licence",
    "Birth Certificate",
    "Income Certificate",
  ];

  const readinessColor =
    result && result.readiness_score >= 80
      ? "text-green-400"
      : result && result.readiness_score >= 40
      ? "text-yellow-400"
      : "text-red-400";

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
            Know before you go
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
            AI Document Checklist
          </h1>
          <div className="mt-4 h-[3px] w-20 rounded-full bg-gradient-to-r from-orange-400 via-white/40 to-green-500" />
          <p className="text-slate-400 mt-4 max-w-lg text-sm sm:text-base">
            Find every document you need before applying — so you&apos;re not
            turned away at the counter.
          </p>
        </div>

        {/* Language */}
        <div className="mb-6">
          <label className="block text-xs uppercase tracking-wide text-slate-500 mb-2">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={loading}
            className="w-full sm:w-56 rounded-lg bg-white/[0.04] border border-white/10 p-3 text-sm
            focus:outline-none focus:border-orange-400/50 transition-colors disabled:opacity-50"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Tamil</option>
            <option>Telugu</option>
            <option>Bengali</option>
          </select>
        </div>

        {/* Quick-pick services */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {services.map((item) => (
            <button
              key={item}
              onClick={() => {
                setService(item);
                setHaveDocs(new Set());
              }}
              disabled={loading}
              className={`rounded-xl border p-3 sm:p-4 text-sm text-left transition-colors disabled:opacity-50 ${
                service === item
                  ? "border-orange-400/50 bg-orange-500/[0.06] text-white"
                  : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-orange-400/40 hover:bg-white/[0.05]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Custom input + action */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
          <label className="block text-xs uppercase tracking-wide text-slate-500 mb-2">
            Or enter a service
          </label>
          <input
            value={service}
            onChange={(e) => {
              setService(e.target.value);
              setHaveDocs(new Set());
            }}
            disabled={loading}
            placeholder="Ex: Passport, Ration Card, Voter ID"
            className="w-full rounded-lg bg-white/[0.04] border border-white/10 p-4 text-sm
            placeholder:text-slate-600 focus:outline-none focus:border-orange-400/50 transition-colors disabled:opacity-50"
          />

          {error && (
            <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            onClick={generateChecklist}
            disabled={loading}
            className="mt-4 w-full sm:w-auto rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500
            transition-colors px-8 py-3 text-sm font-medium"
          >
            {loading ? "🧠 Generating..." : "Generate checklist"}
          </button>
        </div>

        {/* Result */}
        {(loading || result) && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-7">
            <div className="flex justify-between items-start gap-3 mb-6 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1.5">
                  Checklist for
                </p>
                <h2 className="text-base sm:text-lg font-medium">
                  {result?.service || service || "—"}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {result && !loading && (
                  <span className={`text-sm font-medium ${readinessColor}`}>
                    {result.readiness_score}% ready
                  </span>
                )}
                {result && !loading && (
                  <button
                    onClick={() => window.print()}
                    className="shrink-0 flex items-center gap-1.5 rounded-lg border border-white/10 hover:border-white/20
                    transition-colors px-3.5 py-2 text-xs text-slate-300"
                  >
                    🖨️ Save / print
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex gap-1.5 items-center h-5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce" />
              </div>
            ) : result ? (
              <div className="space-y-6 text-sm text-slate-300">

                {result.required_documents.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2.5">
                      Required documents
                    </h3>
                    <div className="space-y-2">
                      {result.required_documents.map((doc) => (
                        <label
                          key={doc.name}
                          className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 cursor-pointer hover:border-white/20 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={haveDocs.has(doc.name) || doc.have_it}
                            onChange={() => toggleHaveDoc(doc.name)}
                            className="h-4 w-4 rounded accent-orange-500 shrink-0"
                          />
                          <span
                            className={
                              haveDocs.has(doc.name) || doc.have_it
                                ? "text-slate-500 line-through"
                                : ""
                            }
                          >
                            {doc.name}
                          </span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      Check off what you already have, then regenerate for an
                      updated readiness score.
                    </p>
                  </div>
                )}

                {result.optional_documents.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                      Optional documents
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-400">
                      {result.optional_documents.map((doc, i) => (
                        <li key={i}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.common_mistakes.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                      Common mistakes to avoid
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-400">
                      {result.common_mistakes.map((mistake, i) => (
                        <li key={i}>{mistake}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">
                      Processing time
                    </p>
                    <p>{result.processing_time}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">
                      Estimated fee
                    </p>
                    <p>{result.estimated_fee}</p>
                  </div>
                </div>

                {result.tips.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                      Tips
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-400">
                      {result.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.official_portal && (
                  <div className="pt-1 break-words">
                    <span className="text-slate-500">Official portal: </span>
                    <span className="text-orange-400">
                      {result.official_portal}
                    </span>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
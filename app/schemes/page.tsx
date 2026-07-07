"use client";

import Link from "next/link";
import { useState } from "react";
import MarkdownAnswer from "@/components/MarkdownAnswer";

interface SchemeForm {
  age: string;
  occupation: string;
  income: string;
  state: string;
  gender: string;
}

export default function SchemePage() {
  const [form, setForm] = useState<SchemeForm>({
    age: "",
    occupation: "",
    income: "",
    state: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function recommendSchemes() {
    if (!form.age.trim() || !form.occupation.trim() || !form.state.trim()) {
      setError("Please fill in at least age, occupation and state.");
      return;
    }

    setError("");
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const data = await res.json();
      setResult(data.answer ?? "");
    } catch (err) {
      console.error(err);
      setError("Unable to fetch schemes. Please try again.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#0a0e17] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-8"
        >
          ← Back to home
        </Link>

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-slate-400 mb-3">
            Find what you&apos;re eligible for
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            AI Scheme Recommender
          </h1>
          <div className="mt-4 h-[3px] w-20 rounded-full bg-gradient-to-r from-orange-400 via-white/40 to-green-500" />
          <p className="text-slate-400 mt-4 max-w-lg">
            Tell us a bit about yourself and AI will match you to relevant
            government schemes.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-500 mb-2">
                Age
              </label>
              <input
                placeholder="Ex: 21"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                disabled={loading}
                className="w-full rounded-lg bg-white/[0.04] border border-white/10 p-3 text-sm
                placeholder:text-slate-600 focus:outline-none focus:border-orange-400/50 transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-500 mb-2">
                Occupation
              </label>
              <input
                placeholder="Ex: Student, Farmer, Self-employed"
                value={form.occupation}
                onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                disabled={loading}
                className="w-full rounded-lg bg-white/[0.04] border border-white/10 p-3 text-sm
                placeholder:text-slate-600 focus:outline-none focus:border-orange-400/50 transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-500 mb-2">
                Annual income
              </label>
              <input
                placeholder="Ex: ₹2,50,000"
                value={form.income}
                onChange={(e) => setForm({ ...form, income: e.target.value })}
                disabled={loading}
                className="w-full rounded-lg bg-white/[0.04] border border-white/10 p-3 text-sm
                placeholder:text-slate-600 focus:outline-none focus:border-orange-400/50 transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-500 mb-2">
                State
              </label>
              <input
                placeholder="Ex: Tamil Nadu"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                disabled={loading}
                className="w-full rounded-lg bg-white/[0.04] border border-white/10 p-3 text-sm
                placeholder:text-slate-600 focus:outline-none focus:border-orange-400/50 transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-500 mb-2">
                Gender
              </label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                disabled={loading}
                className="w-full rounded-lg bg-white/[0.04] border border-white/10 p-3 text-sm
                focus:outline-none focus:border-orange-400/50 transition-colors disabled:opacity-50"
              >
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            onClick={recommendSchemes}
            disabled={loading}
            className="rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500
            transition-colors px-8 py-3 text-sm font-medium"
          >
            {loading ? "🧠 Finding schemes..." : "Find my schemes"}
          </button>
        </div>

        {/* Result */}
        {(loading || result) && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-7">
            <h2 className="text-lg font-medium mb-6">Recommended Schemes</h2>

            {loading ? (
              <div className="flex gap-1.5 items-center h-5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce" />
              </div>
            ) : (
              <MarkdownAnswer content={result} />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
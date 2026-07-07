// app/chatbot/page.tsx — full updated file

"use client";

import Link from "next/link";
import { useState } from "react";
import { useAccessibility } from "@/lib/AccessibilityContext";
import { useSpeechInput } from "@/lib/useSpeechInput";

const langCodeMap: Record<string, string> = {
  English: "en-IN",
  Hindi: "hi-IN",
  Tamil: "ta-IN",
  Telugu: "te-IN",
  Bengali: "bn-IN",
};

interface AIResponse {
  title: string;
  description: string;
  steps: string[];
  documents: string[];
  eligibility: string;
  fees: string;
  processing_time: string;
  official_portal: string;
  tips: string[];
}

export default function ChatbotPage() {
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<AIResponse | null>(null);
  const [error, setError] = useState("");

  const { simplified } = useAccessibility();
  const { toggle: toggleVoice, listening } = useSpeechInput((text) =>
    setQuestion((prev) => (prev ? prev + " " + text : text))
  );

  async function askAI() {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer(null);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, language, simplified }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data: AIResponse = await res.json();
      setAnswer(data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  const examples = [
    "How do I apply for a Passport?",
    "What documents are required for PAN Card?",
    "How can I register a complaint for potholes?",
    "Which scholarship am I eligible for?",
  ];

  return (
    <main className="min-h-screen bg-[#0a0e17] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-8"
        >
          ← Back to home
        </Link>

        <div className="mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-slate-400 mb-3">
            Ask anything
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            AI Civic Assistant
          </h1>
          <div className="mt-4 h-[3px] w-20 rounded-full bg-gradient-to-r from-orange-400 via-white/40 to-green-500" />
          <p className="text-slate-400 mt-4 max-w-lg">
            Ask about government services, documents or schemes — in your
            language.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-xs uppercase tracking-wide text-slate-500 mb-2">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full sm:w-56 rounded-lg bg-white/[0.04] border border-white/10 p-3 text-sm
            focus:outline-none focus:border-orange-400/50 transition-colors"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Tamil</option>
            <option>Telugu</option>
            <option>Bengali</option>
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {examples.map((item) => (
            <button
              key={item}
              onClick={() => setQuestion(item)}
              className="text-left rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300
              hover:border-orange-400/40 hover:bg-white/[0.05] transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs uppercase tracking-wide text-slate-500">
              Your question
            </label>
            <button
              type="button"
              onClick={() => toggleVoice(langCodeMap[language])}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                listening
                  ? "border-red-400/50 text-red-400 bg-red-500/10"
                  : "border-white/10 text-slate-400 hover:border-orange-400/40"
              }`}
            >
              {listening ? "🔴 Listening..." : "🎤 Speak"}
            </button>
          </div>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            placeholder="Ask your question..."
            className="w-full rounded-lg bg-white/[0.04] border border-white/10 p-4 text-sm resize-none
            placeholder:text-slate-600 focus:outline-none focus:border-orange-400/50 transition-colors"
          />

          <button
            onClick={askAI}
            disabled={loading}
            className="mt-4 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500
            transition-colors px-8 py-3 text-sm font-medium"
          >
            {loading ? "🧠 Thinking..." : "Ask AI"}
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {(loading || answer) && (
          <div className="mt-6 flex gap-3">
            <div className="shrink-0 h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-sm">
              🤖
            </div>
            <div className="flex-1 rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.03] p-5">
              {loading ? (
                <div className="flex gap-1.5 items-center h-5">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce" />
                </div>
              ) : answer ? (
                <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">
                      {answer.title}
                    </h2>
                    <p className="text-slate-400">{answer.description}</p>
                  </div>

                  {answer.steps?.length > 0 && (
                    <div>
                      <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                        Steps
                      </h3>
                      <ol className="list-decimal list-inside space-y-1">
                        {answer.steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {answer.documents?.length > 0 && (
                    <div>
                      <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                        Documents required
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {answer.documents.map((doc, i) => (
                          <li key={i}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-3 gap-3 pt-1">
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">
                        Eligibility
                      </p>
                      <p>{answer.eligibility}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">
                        Fees
                      </p>
                      <p>{answer.fees}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">
                        Processing time
                      </p>
                      <p>{answer.processing_time}</p>
                    </div>
                  </div>

                  {answer.tips?.length > 0 && (
                    <div>
                      <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                        Tips
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-slate-400">
                        {answer.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {answer.official_portal && answer.official_portal !== "-" && (
                    <div className="pt-1">
                      <span className="text-slate-500">Official portal: </span>
                      <span className="text-orange-400">
                        {answer.official_portal}
                      </span>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
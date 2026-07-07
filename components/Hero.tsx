import Link from "next/link";

export default function Hero() {
  return (
    <section className="text-center py-24">

      <h1 className="text-6xl font-bold">

        Smart Bharat

      </h1>

      <h2 className="text-2xl text-orange-400 mt-4">

        AI Powered Civic Companion

      </h2>

      <p className="mt-6 text-gray-400 max-w-3xl mx-auto">

        Report civic issues, discover government schemes,
        get document guidance and receive AI-powered
        assistance in multiple Indian languages.

      </p>

      <div className="mt-10 flex justify-center gap-5">

        <Link
          href="/chatbot"
          className="bg-orange-500 px-6 py-3 rounded-lg font-semibold"
        >
          Ask AI
        </Link>

        <Link
          href="/complaint"
          className="border border-orange-500 px-6 py-3 rounded-lg"
        >
          Report Issue
        </Link>

      </div>

    </section>
  );
}
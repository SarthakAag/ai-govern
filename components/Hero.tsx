// components/Hero.tsx
import Link from "next/link";

export default function Hero() {
  return (
    <section className="text-center py-16 sm:py-20 md:py-24 px-4">

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">

        Smart Bharat

      </h1>

      <h2 className="text-lg sm:text-xl md:text-2xl text-orange-400 mt-4">

        AI Powered Civic Companion

      </h2>

      <p className="mt-6 text-sm sm:text-base text-gray-400 max-w-xs sm:max-w-xl md:max-w-3xl mx-auto">

        Report civic issues, discover government schemes,
        get document guidance and receive AI-powered
        assistance in multiple Indian languages.

      </p>

      <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5">

        <Link
          href="/chatbot"
          className="w-full sm:w-auto text-center bg-orange-500 px-6 py-3 rounded-lg font-semibold"
        >
          Ask AI
        </Link>

        <Link
          href="/complaint"
          className="w-full sm:w-auto text-center border border-orange-500 px-6 py-3 rounded-lg"
        >
          Report Issue
        </Link>

      </div>

    </section>
  );
}
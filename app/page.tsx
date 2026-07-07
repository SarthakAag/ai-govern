import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";

type Accent = "saffron" | "green" | "blue";

type Feature = {
  emoji: string;
  title: string;
  description: string;
  href: string;
  accent: Accent;
};

const features: Feature[] = [
  {
    emoji: "🤖",
    title: "AI Civic Assistant",
    description: "Ask questions about services, documents and schemes.",
    href: "/chatbot",
    accent: "saffron",
  },
  {
    emoji: "🚧",
    title: "Report Public Issue",
    description: "Submit complaints — AI flags department and urgency.",
    href: "/complaint",
    accent: "green",
  },
  {
    emoji: "📋",
    title: "Complaint Tracker",
    description: "Track status with AI-generated transparency insights.",
    href: "/tracker",
    accent: "blue",
  },
  {
    emoji: "🏛️",
    title: "Scheme Recommender",
    description: "Find schemes matched to your profile.",
    href: "/schemes",
    accent: "saffron",
  },
  {
    emoji: "📄",
    title: "Document Assistant",
    description: "Know exactly what documents you need.",
    href: "/documents",
    accent: "blue",
  },
  {
    emoji: "🌐",
    title: "Multilingual AI",
    description: "English, Hindi, Tamil, Telugu, Bengali.",
    href: "/chatbot",
    accent: "green",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0e17] text-white">
      <Navbar />
      <Hero />

      <section className="max-w-6xl mx-auto px-6 py-20">
        {/* Section header with signature tricolor rule */}
        <div className="mb-12">
          <p className="text-xs tracking-[0.2em] uppercase text-slate-400 mb-3">
            What you can do
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Every civic service, in one place
          </h2>
          <div className="mt-4 h-[3px] w-20 rounded-full bg-gradient-to-r from-orange-400 via-white/40 to-green-500" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>
    </main>
  );
}
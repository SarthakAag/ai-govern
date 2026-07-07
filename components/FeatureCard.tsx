// components/FeatureCard.tsx
import Link from "next/link";

const accentMap = {
  saffron: "group-hover:border-orange-400/50 group-hover:shadow-orange-500/10",
  green: "group-hover:border-green-400/50 group-hover:shadow-green-500/10",
  blue: "group-hover:border-blue-400/50 group-hover:shadow-blue-500/10",
};

const glowMap = {
  saffron: "bg-orange-500/10",
  green: "bg-green-500/10",
  blue: "bg-blue-500/10",
};

type Props = {
  emoji: string;
  title: string;
  description: string;
  href: string;
  accent: "saffron" | "green" | "blue";
};

export default function FeatureCard({ emoji, title, description, href, accent }: Props) {
  return (
    <Link href={href} className="group block">
      <div
        className={`relative h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6
        transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06]
        hover:shadow-lg ${accentMap[accent]}`}
      >
        {/* Ambient glow blob, only visible on hover */}
        <div
          className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-0
          group-hover:opacity-100 transition-opacity duration-300 ${glowMap[accent]}`}
        />

        <div className="relative">
          <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 text-xl mb-4">
            {emoji}
          </div>
          <h3 className="text-lg font-medium mb-1.5">{title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{description}</p>

          <div className="mt-4 flex items-center text-sm text-slate-500 group-hover:text-slate-300 transition-colors">
            <span>Open</span>
            <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
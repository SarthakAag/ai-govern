"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccessibility } from "@/lib/AccessibilityContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/chatbot", label: "Assistant" },
  { href: "/complaint", label: "Complaint" },
  { href: "/tracker", label: "Tracker" },
  { href: "/schemes", label: "Schemes" },
  { href: "/documents", label: "Documents" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { simplified, toggle } = useAccessibility();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0e17]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Wordmark with tricolor accent dot instead of flag emoji */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-gradient-to-br from-orange-400 via-white to-green-500" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">
            Smart Bharat
          </span>
        </Link>

        {/* Links + accessibility toggle */}
        <div className="flex items-center gap-1 text-sm">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 rounded-lg transition-colors ${
                  isActive ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute left-3 right-3 -bottom-[1px] h-[2px] rounded-full bg-gradient-to-r from-orange-400 to-green-500" />
                )}
              </Link>
            );
          })}

          <button
            onClick={toggle}
            className={`ml-2 text-xs px-3 py-1.5 rounded-full border transition-colors ${
              simplified
                ? "border-orange-400/50 text-orange-400 bg-orange-500/10"
                : "border-white/10 text-slate-400 hover:border-white/20"
            }`}
          >
            {simplified ? "Aa Simple: On" : "Aa Simple"}
          </button>
        </div>
      </div>
    </nav>
  );
}
// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0e17]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 sm:px-6 py-4">
        {/* Wordmark with tricolor accent dot instead of flag emoji */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-gradient-to-br from-orange-400 via-white to-green-500" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">
            Smart Bharat
          </span>
        </Link>

        {/* Desktop links + accessibility toggle */}
        <div className="hidden lg:flex items-center gap-1 text-sm">
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

        {/* Mobile: accessibility toggle + hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={toggle}
            className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors ${
              simplified
                ? "border-orange-400/50 text-orange-400 bg-orange-500/10"
                : "border-white/10 text-slate-400 hover:border-white/20"
            }`}
          >
            {simplified ? "Aa: On" : "Aa"}
          </button>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="flex flex-col justify-center gap-1.5 w-9 h-9 rounded-lg border border-white/10 hover:border-white/20 transition-colors items-center"
          >
            <span
              className={`block h-[1.5px] w-4 bg-slate-300 transition-transform ${
                mobileOpen ? "rotate-45 translate-y-[3px]" : ""
              }`}
            />
            <span
              className={`block h-[1.5px] w-4 bg-slate-300 transition-transform ${
                mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0a0e17]/95 backdrop-blur-md px-4 sm:px-6 py-3 flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "text-white bg-white/[0.06]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
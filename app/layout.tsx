import type { Metadata } from "next";
import "./globals.css";
import { AccessibilityProvider } from "@/lib/AccessibilityContext";

export const metadata: Metadata = {
  title: "Smart Bharat",
  description: "AI Powered Civic Companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        <AccessibilityProvider>{children}</AccessibilityProvider>
      </body>
    </html>
  );
}
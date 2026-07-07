// components/MarkdownAnswer.tsx
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownAnswer({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none
      prose-headings:font-medium prose-headings:text-white prose-headings:mt-5 prose-headings:mb-2
      prose-h3:text-base prose-h2:text-lg
      prose-p:text-slate-300 prose-p:leading-relaxed
      prose-strong:text-white prose-strong:font-semibold
      prose-li:text-slate-300 prose-li:my-1
      prose-ul:my-3 prose-ol:my-3
      prose-a:text-orange-400 prose-a:no-underline hover:prose-a:underline
      prose-hr:border-white/10 prose-hr:my-6"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
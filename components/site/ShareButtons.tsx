"use client";

import { useState } from "react";
import SocialIcon from "@/components/site/SocialIcon";
import { SOCIAL_LABELS, SocialNetwork } from "@/lib/social";

// "Share this" row on tour / product / event pages. `url` is the full page
// address (SITE_URL + path), so shared links work outside localhost too.
export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const link = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  const targets: { network: SocialNetwork; href: string }[] = [
    { network: "whatsapp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
    { network: "facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${link}` },
    { network: "x", href: `https://x.com/intent/post?url=${link}&text=${text}` },
    { network: "linkedin", href: `https://www.linkedin.com/sharing/share-offsite/?url=${link}` },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  const button =
    "grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-navy-800 transition hover:-translate-y-0.5 hover:border-gold-500/60 hover:text-gold-600";

  return (
    <div>
      <h2 className="text-sm font-semibold text-navy-900">Share</h2>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {targets.map((target) => (
          <a
            key={target.network}
            href={target.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${SOCIAL_LABELS[target.network]}`}
            title={`Share on ${SOCIAL_LABELS[target.network]}`}
            className={button}
          >
            <SocialIcon network={target.network} className="h-4.5 w-4.5" />
          </a>
        ))}
        <button type="button" onClick={copy} aria-label="Copy link" className={button}>
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {copied ? (
              <path d="M5 12.5 10 17l9-10" />
            ) : (
              <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />
            )}
          </svg>
        </button>
        <span role="status" className="text-xs text-slate-500">{copied ? "Link copied" : ""}</span>
      </div>
    </div>
  );
}

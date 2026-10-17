import type { Metadata } from "next";

// ───────────── Social media: fill these in ─────────────
// Paste the full link to each Gazellekey page. Leave "" for networks you do
// not use - they are hidden on the website.
export const SOCIAL_LINKS = {
  facebook: "", // e.g. "https://www.facebook.com/gazellekey"
  instagram: "", // e.g. "https://www.instagram.com/gazellekey"
  linkedin: "", // e.g. "https://www.linkedin.com/company/gazellekey"
  youtube: "", // e.g. "https://www.youtube.com/@gazellekey"
  tiktok: "", // e.g. "https://www.tiktok.com/@gazellekey"
  x: "", // e.g. "https://x.com/gazellekey"
};

// WhatsApp number in international format, digits only (94 = Sri Lanka),
// e.g. "94771234567". Shows the green chat button. "" hides it.
export const WHATSAPP_NUMBER = "";

// The public address of this website, used in link previews on Facebook,
// WhatsApp, LinkedIn etc. Set NEXT_PUBLIC_SITE_URL in .env.local when live.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002").replace(/\/$/, "");
// ───────────────────────────────────────────────────────

export type SocialNetwork = keyof typeof SOCIAL_LINKS | "whatsapp";

export const SOCIAL_LABELS: Record<SocialNetwork, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  tiktok: "TikTok",
  x: "X (Twitter)",
  whatsapp: "WhatsApp",
};

// Only the networks that have a link
export function socialProfiles(): { network: SocialNetwork; url: string }[] {
  const profiles = (Object.keys(SOCIAL_LINKS) as (keyof typeof SOCIAL_LINKS)[])
    .filter((network) => SOCIAL_LINKS[network] != "")
    .map((network) => ({ network: network as SocialNetwork, url: SOCIAL_LINKS[network] }));
  if (WHATSAPP_NUMBER != "") {
    profiles.push({ network: "whatsapp", url: whatsappUrl() });
  }
  return profiles;
}

export function whatsappUrl(text?: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

// Link preview (title, text, photo) for a page shared on social media
export function shareMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description?: string | null;
  path: string;
  image?: string | null;
}): Metadata {
  const images = image ? [{ url: image, alt: title }] : undefined;
  return {
    title,
    description: description ?? undefined,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Gazellekey International",
      title,
      description: description ?? undefined,
      url: path,
      images,
    },
    twitter: { card: "summary_large_image", title, description: description ?? undefined, images },
  };
}

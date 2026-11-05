import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import WhatsAppButton from "@/components/site/WhatsAppButton";
import ChatWidget from "@/components/chat/ChatWidget";
import Toasts from "@/components/site/Toasts";
import { HOME_HERO_IMAGE } from "@/lib/media";
import { COMPANY, SEARCH_INDEXING, SITE_URL, socialProfiles, WHATSAPP_NUMBER } from "@/lib/social";
import { getDictionary } from "@/lib/i18n-server";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const SITE_TITLE = "Gazellekey International | Travel, Events, Gems, Vehicles, Import & Export";
const SITE_DESCRIPTION =
  "One platform, six business divisions, global opportunities. Travel services, event management, gems & jewellery, vehicles & machinery, import and export.";

export const metadata: Metadata = {
  // full URLs for link previews on Facebook, WhatsApp, LinkedIn, X
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Gazellekey International",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Gazellekey International",
    locale: "en_GB",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: HOME_HERO_IMAGE, alt: "Gazellekey International" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [HOME_HERO_IMAGE],
  },
  applicationName: "Gazellekey International",
  // iPhones (and the WhatsApp browser) turn phone-number-like text into links,
  // which changes the page before React starts - keep it as written
  formatDetection: { telephone: false, email: false, address: false },
  keywords: [
    "Gazellekey International",
    "Gazellekey",
    "Gazelle Key International",
    "Sri Lanka travel agency",
    "overseas jobs Sri Lanka",
    "work visa",
    "event management Sri Lanka",
    "gems and jewellery",
    "vehicle import Sri Lanka",
    "import export Sri Lanka",
  ],
  alternates: { canonical: "/" },
  // while testing, search engines must not list the site (see lib/social.ts)
  robots: SEARCH_INDEXING ? { index: true, follow: true } : { index: false, follow: false },
  // codes from Google Search Console / Bing Webmaster Tools ("HTML tag" method)
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

// Tells Google the site's name, so results show "Gazellekey International"
// (https://developers.google.com/search/docs/appearance/site-names)
function websiteData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: COMPANY.name,
    alternateName: ["Gazellekey", "Gazelle Key International"],
    url: `${SITE_URL}/`,
  };
}

// Company details for search engines (schema.org), from lib/social.ts.
// Empty fields are left out.
function companyData() {
  const address =
    COMPANY.streetAddress || COMPANY.city
      ? {
          "@type": "PostalAddress",
          streetAddress: COMPANY.streetAddress || undefined,
          addressLocality: COMPANY.city || undefined,
          addressCountry: COMPANY.country,
        }
      : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.name,
    alternateName: "Gazellekey",
    legalName: COMPANY.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description: SITE_DESCRIPTION,
    telephone: COMPANY.phone || undefined,
    email: COMPANY.email || undefined,
    address: address,
    sameAs: socialProfiles()
      .filter((profile) => profile.network != "whatsapp")
      .map((profile) => profile.url),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { lang } = await getDictionary(); // the visitor's language (globe menu)
  return (
    <html
      lang={lang}
      className={`${jakarta.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <script
          type="application/ld+json"
          // JSON, with "<" escaped so text can never close the script tag
          dangerouslySetInnerHTML={{ __html: JSON.stringify([websiteData(), companyData()]).replace(/</g, "\\u003c") }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        {/* AI assistant bubble; sits above the WhatsApp button when that is shown */}
        <ChatWidget raised={WHATSAPP_NUMBER != ""} />
        {/* pop-up messages (react-hot-toast) for every page */}
        <Toasts />
      </body>
    </html>
  );
}

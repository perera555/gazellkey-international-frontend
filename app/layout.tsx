import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import WhatsAppButton from "@/components/site/WhatsAppButton";
import { HOME_HERO_IMAGE } from "@/lib/media";
import { SITE_URL } from "@/lib/social";
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}

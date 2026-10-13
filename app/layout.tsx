import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Gazellekey International | Travel, Events, Gems, Vehicles, Import & Export",
    template: "%s | Gazellekey International",
  },
  description:
    "One platform, six business divisions, global opportunities. Travel services, event management, gems & jewellery, vehicles & machinery, import and export.",
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
      </body>
    </html>
  );
}

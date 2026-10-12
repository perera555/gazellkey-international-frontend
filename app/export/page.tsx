import type { Metadata } from "next";
import TradeCatalogue from "@/components/trade/TradeCatalogue";
import { DIVISIONS } from "@/lib/divisions";

export const metadata: Metadata = {
  title: "Export",
  description: DIVISIONS.EXPORT.tagline,
};

export default async function ExportPage({ searchParams }: PageProps<"/export">) {
  return <TradeCatalogue direction="EXPORT" searchParams={await searchParams} />;
}

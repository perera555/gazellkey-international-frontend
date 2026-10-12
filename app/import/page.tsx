import type { Metadata } from "next";
import TradeCatalogue from "@/components/trade/TradeCatalogue";
import { DIVISIONS } from "@/lib/divisions";

export const metadata: Metadata = {
  title: "Import",
  description: DIVISIONS.IMPORT.tagline,
};

export default async function ImportPage({ searchParams }: PageProps<"/import">) {
  return <TradeCatalogue direction="IMPORT" searchParams={await searchParams} />;
}

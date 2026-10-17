import type { Metadata } from "next";
import TradeDetail, { tradeMetadata } from "@/components/trade/TradeDetail";

export async function generateMetadata({ params }: PageProps<"/export/[sku]">): Promise<Metadata> {
  return tradeMetadata("EXPORT", (await params).sku);
}

export default async function ExportProductPage({ params }: PageProps<"/export/[sku]">) {
  return <TradeDetail direction="EXPORT" sku={(await params).sku} />;
}

import type { Metadata } from "next";
import TradeDetail, { tradeMetadata } from "@/components/trade/TradeDetail";

export async function generateMetadata({ params }: PageProps<"/import/[sku]">): Promise<Metadata> {
  return tradeMetadata("IMPORT", (await params).sku);
}

export default async function ImportProductPage({ params }: PageProps<"/import/[sku]">) {
  return <TradeDetail direction="IMPORT" sku={(await params).sku} />;
}

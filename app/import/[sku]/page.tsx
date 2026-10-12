import type { Metadata } from "next";
import TradeDetail, { getTradeProduct } from "@/components/trade/TradeDetail";

export async function generateMetadata({ params }: PageProps<"/import/[sku]">): Promise<Metadata> {
  const product = await getTradeProduct("IMPORT", (await params).sku);
  return { title: product.name, description: product.description.slice(0, 160) };
}

export default async function ImportProductPage({ params }: PageProps<"/import/[sku]">) {
  return <TradeDetail direction="IMPORT" sku={(await params).sku} />;
}

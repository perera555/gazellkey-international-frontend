import type { Metadata } from "next";
import TradeDetail, { getTradeProduct } from "@/components/trade/TradeDetail";

export async function generateMetadata({ params }: PageProps<"/export/[sku]">): Promise<Metadata> {
  const product = await getTradeProduct("EXPORT", (await params).sku);
  return { title: product.name, description: product.description.slice(0, 160) };
}

export default async function ExportProductPage({ params }: PageProps<"/export/[sku]">) {
  return <TradeDetail direction="EXPORT" sku={(await params).sku} />;
}

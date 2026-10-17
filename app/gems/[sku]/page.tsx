import type { Metadata } from "next";
import { cache } from "react";
import DetailLayout, { FactList } from "@/components/site/DetailLayout";
import DivisionHero from "@/components/site/DivisionHero";
import StatusBadge from "@/components/site/StatusBadge";
import EnquiryForm from "@/components/forms/EnquiryForm";
import AddToCart from "@/components/shop/AddToCart";
import SignInGate from "@/components/site/SignInGate";
import { apiGetItem } from "@/lib/api";
import { DIVISIONS } from "@/lib/divisions";
import { formatFileSize, humanize, priceLabel } from "@/lib/format";
import { fallbackImage } from "@/lib/media";
import { getSessionUser } from "@/lib/session";
import { shareMetadata } from "@/lib/social";
import { GemItem } from "@/lib/types";

const division = DIVISIONS.GEMS;

const getItem = cache((sku: string) =>
  apiGetItem<GemItem>(`/api/gems/${encodeURIComponent(sku)}`),
);

export async function generateMetadata({ params }: PageProps<"/gems/[sku]">): Promise<Metadata> {
  const item = await getItem((await params).sku);
  return shareMetadata({
    title: item.name,
    description: item.description.slice(0, 160),
    path: `/gems/${item.sku}`,
    image: item.images[0] ?? fallbackImage("GEMS", item.itemType),
  });
}

export default async function GemPage({ params }: PageProps<"/gems/[sku]">) {
  const item = await getItem((await params).sku);
  const user = await getSessionUser();
  const certificates = item.certificates ?? [];

  return (
    <>
      <DivisionHero
        division={division}
        title={item.name}
        subtitle={item.category}
        breadcrumb={{ href: "/gems", label: "Gems & Jewellery" }}
        image={item.images[0]}
      />
      <DetailLayout
        title={item.name}
        sharePath={`/gems/${item.sku}`}
        images={item.images}
        fallbackImage={fallbackImage("GEMS", item.itemType)}
        main={
          <>
            <section>
              <h2 className="heading-display text-2xl">Description</h2>
              <p className="mt-4 whitespace-pre-line text-slate-700">{item.description}</p>
            </section>
            {certificates.length > 0 ? (
              <section>
                <h2 className="font-semibold text-navy-900">Certificates</h2>
                <ul className="mt-3 space-y-2">
                  {certificates.map((doc) => (
                    <li key={doc.id}>
                      <a
                        href={`/api/documents/${doc.id}/download`}
                        className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm hover:bg-navy-50"
                      >
                        <span className="font-medium text-navy-900">{doc.title}</span>
                        <span className="text-slate-500">{formatFileSize(doc.size)} · Download</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        }
        aside={
          <>
            <div className="card overflow-hidden p-6">
              <span className="-mx-6 -mt-6 mb-5 block h-1.5" style={{ background: division.color }} />
              <div className="flex items-start justify-between gap-3">
                <p className="text-3xl font-bold text-navy-900">{priceLabel(item)}</p>
                <StatusBadge value={item.availability} />
              </div>
              <div className="mt-4">
                <FactList
                  facts={[
                    ["Type", humanize(item.itemType)],
                    ["Reference", item.sku],
                    ["Weight", item.weight ? `${Number(item.weight)} ${item.weightUnit}` : null],
                    ["Colour", item.colour],
                    ["Cut", item.cut],
                    ["Shape", item.shape],
                    ["Clarity", item.clarity],
                    ["Origin", item.origin],
                    ["Treatment", item.treatment],
                    ["Metal", item.metal],
                  ]}
                />
              </div>
              {item.pricingMode == "FIXED" && item.price != null && item.currency && item.availability == "AVAILABLE" ? (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <AddToCart
                    item={{
                      itemType: "GEM_ITEM",
                      itemId: item.id,
                      name: item.name,
                      sku: item.sku,
                      href: `/gems/${item.sku}`,
                      image: item.images[0] ?? null,
                      unitPrice: item.price,
                      currency: item.currency,
                      unit: "piece",
                      min: 1,
                      max: 1, // one-off piece
                      wholeNumbers: true,
                    }}
                  />
                </div>
              ) : null}
            </div>
            <div id="enquire" className="card scroll-mt-36 p-6">
              {user == null ? (
                <SignInGate
                  title="Sign up to enquire"
                  text="Create a free account to ask about this piece and follow our reply."
                  returnTo={`/gems/${item.sku}#enquire`}
                  compact
                />
              ) : (
                <>
                  <h2 className="font-semibold text-navy-900">Enquire about this piece</h2>
                  <div className="mt-4">
                    <EnquiryForm
                      division="GEMS"
                      services={division.services}
                      defaultService="GEM_PURCHASE"
                      itemType="GEM_ITEM"
                      itemId={item.id}
                      defaultSubject={`${item.name} (${item.sku})`}
                      prefill={user}
                      submitLabel="Request details"
                    />
                  </div>
                </>
              )}
            </div>
          </>
        }
      />
    </>
  );
}

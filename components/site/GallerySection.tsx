import Link from "next/link";
import PhotoGallery from "@/components/site/PhotoGallery";
import { apiGetBody } from "@/lib/api";
import { GalleryPhoto } from "@/lib/types";

// "Moments from our trips": a photo mosaic preview of /gallery.
// Shows nothing when the gallery is empty.
export default async function GallerySection({
  heading = "Moments from our trips",
  text = "Photos from holidays and tours our customers took with Gazellekey.",
}: {
  heading?: string;
  text?: string;
}) {
  const result = await apiGetBody<{ data: GalleryPhoto[]; pagination?: { totalCount: number } }>(
    "/api/gallery?division=TRAVEL&pageSize=12",
  );
  if (!result.ok || result.body.data.length == 0) {
    return null;
  }

  return (
    <section className="reveal container-page pb-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Gallery</p>
          <h2 className="heading-display mt-2 text-3xl sm:text-4xl">{heading}</h2>
          <p className="mt-3 max-w-2xl text-slate-500">{text}</p>
        </div>
        <Link href="/gallery" className="btn-outline btn-sm shrink-0">
          View full gallery
        </Link>
      </div>
      <div className="mt-8">
        <PhotoGallery photos={result.body.data} layout="mosaic" />
      </div>
    </section>
  );
}

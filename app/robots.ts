import type { MetadataRoute } from "next";
import { SEARCH_INDEXING, SITE_URL } from "@/lib/social";

// /robots.txt - while NEXT_PUBLIC_SEARCH_INDEXING is not "on" (testing),
// search engines are asked to stay away from the whole site.
export default function robots(): MetadataRoute.Robots {
  if (!SEARCH_INDEXING) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // private or pointless for search: customer area, cart, checkout, the API
      disallow: ["/account", "/cart", "/checkout", "/login", "/register", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

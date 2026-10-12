import { Division } from "@/lib/types";

// Site photography in /public/images (Unsplash licence: free to use commercially).
// Heroes use these, and so does any catalogue item that has no photo of its own.

export const HOME_HERO_IMAGE = "/images/hero-beach.jpg";

export const DIVISION_IMAGES: Record<Division, string> = {
  TRAVEL: "/images/travel-maldives.jpg",
  EVENTS: "/images/events-festival.jpg",
  GEMS: "/images/gems-pink-sapphire.jpg",
  VEHICLES: "/images/vehicles-car.jpg",
  IMPORT: "/images/import-containers.jpg",
  EXPORT: "/images/export-ship.jpg",
};

// Photos for catalogue categories (division service values / listing types)
export const CATEGORY_IMAGES: Record<string, string> = {
  TEA: "/images/export-tea.jpg",
  SPICES: "/images/export-spices.jpg",
  COFFEE: "/images/export-coffee.jpg",
  CHOCOLATE: "/images/export-chocolate.jpg",
  FRUITS_VEGETABLES: "/images/export-fruits.jpg",
  ELECTRICAL_ITEMS: "/images/import-electronics.jpg",
  COMPUTERS_HARDWARE_PHONES: "/images/import-electronics.jpg",
  HEAVY_MACHINERY: "/images/vehicles-excavator.jpg",
  CONFERENCE: "/images/events-conference.jpg",
  TRADE_SHOW: "/images/events-conference.jpg",
  WORKSHOP: "/images/events-conference.jpg",
  JEWELLERY: "/images/gems-coloured-rings.jpg",
  // Neutral clear stones, so a listed sapphire never shows a red picture
  GEMSTONE: "/images/gems-diamonds.jpg",
};

// Picture for a listing without its own photo
export function fallbackImage(division: Division, category?: string | null) {
  return (category ? CATEGORY_IMAGES[category] : undefined) ?? DIVISION_IMAGES[division];
}

// Inspiration tiles on the home and travel pages (link to the tour search)
export const DESTINATIONS = [
  { name: "Sri Lanka", text: "Sigiriya, Ella and the hill country", image: "/images/travel-ella.jpg", href: "/travel?tourType=INBOUND" },
  { name: "Maldives", text: "Island resorts and lagoons", image: "/images/travel-maldives.jpg", href: "/travel?search=Maldives" },
  { name: "Thailand", text: "Temples, markets and beaches", image: "/images/travel-thailand.jpg", href: "/travel?search=Thailand" },
  { name: "Singapore", text: "City breaks and family trips", image: "/images/travel-singapore.jpg", href: "/travel?search=Singapore" },
];

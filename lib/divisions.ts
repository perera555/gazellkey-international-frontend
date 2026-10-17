import { Division } from "@/lib/types";

export type Option = { value: string; label: string };

export type DivisionInfo = {
  key: Division;
  name: string;
  short: string;
  href: string;
  color: string; // division accent (SRS 9.2)
  tagline: string;
  services: Option[]; // used as "serviceType" on enquiries
};

// Division names, colours and services (SRS Section 2 and 9.2)
export const DIVISIONS: Record<Division, DivisionInfo> = {
  TRAVEL: {
    key: "TRAVEL",
    name: "Travel Services",
    short: "Travel",
    href: "/travel",
    color: "#1E88E5",
    tagline: "Visas, tours, flights and travel insurance - planned for you.",
    services: [
      { value: "VISA", label: "Visa services" },
      { value: "OUTBOUND_TOUR", label: "Outbound tours" },
      { value: "INBOUND_TOUR", label: "Inbound tours" },
      { value: "AIR_TICKET", label: "Air ticketing" },
      { value: "HOTEL", label: "Hotel booking" },
      { value: "TRAVEL_INSURANCE", label: "Travel insurance" },
    ],
  },
  EVENTS: {
    key: "EVENTS",
    name: "Event Management",
    short: "Events",
    href: "/events",
    color: "#F26B21",
    tagline: "Trade shows, exhibitions, conferences, festivals and tournaments.",
    services: [
      { value: "EVENT_REGISTRATION", label: "Register for an event" },
      { value: "ORGANISE_EVENT", label: "Organise my event" },
      { value: "EXHIBITOR_SPACE", label: "Exhibitor / stall space" },
    ],
  },
  GEMS: {
    key: "GEMS",
    name: "Gems & Jewellery",
    short: "Gems",
    href: "/gems",
    color: "#8E24AA",
    tagline: "Certified Ceylon gems and handcrafted jewellery.",
    services: [
      { value: "GEM_PURCHASE", label: "Buy a gem or jewellery" },
      { value: "JEWELLERY_MAKING", label: "Jewellery making" },
      { value: "GEM_MINING", label: "Gem mining" },
      { value: "GEM_DEALING", label: "Gem dealing" },
      { value: "GEM_EXPORT", label: "Gem export" },
      { value: "GEM_IMPORT", label: "Gem import" },
    ],
  },
  VEHICLES: {
    key: "VEHICLES",
    name: "Vehicles & Machinery",
    short: "Vehicles",
    href: "/vehicles",
    color: "#2E9E4F",
    tagline: "New and used vehicles, spare parts and heavy machinery.",
    services: [
      { value: "NEW_VEHICLE", label: "Brand-new vehicle" },
      { value: "USED_VEHICLE", label: "Used vehicle" },
      { value: "SPARE_PART", label: "Spare parts" },
      { value: "HEAVY_MACHINERY", label: "Heavy machinery" },
    ],
  },
  IMPORT: {
    key: "IMPORT",
    name: "Import",
    short: "Import",
    href: "/import",
    color: "#E53935",
    tagline: "Quality goods sourced worldwide and delivered to Sri Lanka.",
    services: [
      { value: "SPORTS_ITEMS", label: "Sports items" },
      { value: "SHOES", label: "Shoes" },
      { value: "CLOTHES", label: "Clothes" },
      { value: "FANCY_ITEMS", label: "Fancy items" },
      { value: "ELECTRICAL_ITEMS", label: "Electrical items" },
      { value: "COMPUTERS_HARDWARE_PHONES", label: "Computers, hardware & phones" },
      { value: "FOOD_ITEMS", label: "Food items" },
      { value: "POWER_HAND_TOOLS", label: "Power & hand tools" },
    ],
  },
  EXPORT: {
    key: "EXPORT",
    name: "Export",
    short: "Export",
    href: "/export",
    color: "#E0A100",
    tagline: "Ceylon coffee, tea, spices, chocolate and fresh produce to the world.",
    services: [
      { value: "COFFEE", label: "Coffee" },
      { value: "CHOCOLATE", label: "Chocolate" },
      { value: "TEA", label: "Tea" },
      { value: "SPICES", label: "Spices" },
      { value: "FRUITS_VEGETABLES", label: "Fruits & vegetables" },
    ],
  },
};

export const DIVISION_LIST = Object.values(DIVISIONS);

export function isDivision(value: string | undefined): value is Division {
  return value != undefined && value in DIVISIONS;
}

export function labelOf(options: Option[], value: string | null | undefined) {
  return options.find((option) => option.value == value)?.label ?? value ?? "";
}

// Filter options for the catalogue pages (values match the backend enums)
export const TOUR_TYPES: Option[] = [
  { value: "OUTBOUND", label: "Outbound tours" },
  { value: "INBOUND", label: "Sri Lanka tours" },
];

export const EVENT_TYPES: Option[] = [
  { value: "TRADE_SHOW", label: "Trade shows" },
  { value: "EXHIBITION", label: "Exhibitions" },
  { value: "WORKSHOP", label: "Workshops" },
  { value: "CONFERENCE", label: "Conferences" },
  { value: "FOOD_FESTIVAL", label: "Food festivals" },
  { value: "SPORTS_TOURNAMENT", label: "Sports tournaments" },
];

export const GEM_TYPES: Option[] = [
  { value: "GEMSTONE", label: "Gemstones" },
  { value: "JEWELLERY", label: "Jewellery" },
];

// Gem collection shortcuts (design document, slide 9)
export const GEM_CHIPS = [
  { href: "/gems?search=sapphire", label: "Sapphire" },
  { href: "/gems?search=ruby", label: "Ruby" },
  { href: "/gems?search=emerald", label: "Emerald" },
  { href: "/gems?itemType=GEMSTONE", label: "Other Gems" },
  { href: "/gems?itemType=JEWELLERY", label: "Jewellery" },
];

export const VEHICLE_TYPES: Option[] = [
  { value: "NEW_VEHICLE", label: "New vehicles" },
  { value: "USED_VEHICLE", label: "Used vehicles" },
  { value: "SPARE_PART", label: "Spare parts" },
  { value: "HEAVY_MACHINERY", label: "Heavy machinery" },
];

// Country -> place lists for the tour and hotel pickers. Popular places are
// always offered (we plan tours and book hotels anywhere); places in our
// catalogue are added with their counts (GET /api/travel/places).

export type PlaceEntry = { name: string; count: number; hotels?: { slug: string; name: string }[] };
export type CountryEntry = { country: string; count: number; places: PlaceEntry[] };
export type TravelPlaces = { tours: CountryEntry[]; hotels: CountryEntry[] };

const POPULAR_TOUR_PLACES: Record<string, string[]> = {
  "Sri Lanka": ["Colombo", "Kandy", "Sigiriya", "Dambulla", "Nuwara Eliya", "Ella", "Yala", "Galle", "Mirissa", "Bentota", "Trincomalee", "Jaffna", "Anuradhapura"],
  Maldives: ["Maldives", "Malé", "Maafushi"],
  Thailand: ["Bangkok", "Phuket", "Pattaya", "Krabi", "Chiang Mai"],
  Singapore: ["Singapore"],
  Malaysia: ["Kuala Lumpur", "Langkawi", "Penang"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi"],
  India: ["Dambadiva (India & Nepal)", "Delhi & Agra", "Goa", "Kerala", "Chennai"],
  Japan: ["Tokyo", "Kyoto", "Osaka"],
  Turkey: ["Istanbul", "Cappadocia"],
  Europe: ["Paris", "Switzerland", "Rome", "London"],
};

const POPULAR_HOTEL_PLACES: Record<string, string[]> = {
  "Sri Lanka": ["Colombo", "Kandy", "Galle", "Ella", "Sigiriya", "Nuwara Eliya", "Bentota", "Mirissa", "Trincomalee", "Negombo"],
  Maldives: ["Malé", "South Malé Atoll", "North Malé Atoll", "Maafushi"],
  Thailand: ["Bangkok", "Phuket", "Pattaya"],
  Singapore: ["Singapore"],
  Malaysia: ["Kuala Lumpur", "Langkawi"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi"],
  India: ["Chennai", "Delhi", "Goa"],
};

// catalogue first (countries / places with something listed), then the rest A-Z
export function mergePlaces(catalogue: CountryEntry[], kind: "tours" | "hotels"): CountryEntry[] {
  const popular = kind == "tours" ? POPULAR_TOUR_PLACES : POPULAR_HOTEL_PLACES;
  const countries = new Map<string, CountryEntry>();
  for (const entry of catalogue) {
    countries.set(entry.country.toLowerCase(), { ...entry, places: entry.places.map((place) => ({ ...place })) });
  }
  for (const [country, places] of Object.entries(popular)) {
    const key = country.toLowerCase();
    if (!countries.has(key)) countries.set(key, { country, count: 0, places: [] });
    const entry = countries.get(key)!;
    for (const name of places) {
      if (!entry.places.some((place) => place.name.toLowerCase() == name.toLowerCase())) {
        entry.places.push({ name, count: 0, ...(kind == "hotels" ? { hotels: [] } : {}) });
      }
    }
  }
  return [...countries.values()]
    .map((entry) => ({
      ...entry,
      places: entry.places.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => b.count - a.count || a.country.localeCompare(b.country));
}

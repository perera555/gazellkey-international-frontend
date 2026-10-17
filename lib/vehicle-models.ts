// Makes and models for the vehicles page: "browse by make & model" and the
// make -> model pickers. Popular models in Sri Lanka are always listed (we
// import to order), and anything in our catalogue is added with its counts
// (GET /api/vehicles/models).
//
// Spare parts name the models they fit as "Make Model" (e.g. "Toyota Aqua")
// in their "compatible with" list, so keep makes to one word here.

export type ModelEntry = { model: string; vehicles: number; parts: number };
export type MakeEntry = { make: string; vehicles: number; parts: number; models: ModelEntry[]; machinery?: boolean };

const POPULAR: { make: string; models: string[]; machinery?: boolean }[] = [
  { make: "Toyota", models: ["Aqua", "Axio", "Corolla", "Prius", "Vitz", "Yaris", "Premio", "Allion", "C-HR", "Raize", "Hilux", "HiAce", "Land Cruiser"] },
  { make: "Honda", models: ["Vezel", "Fit", "Grace", "Civic", "CR-V", "Insight", "N-Box"] },
  { make: "Nissan", models: ["Leaf", "X-Trail", "Sunny", "March", "Note", "Dayz", "Caravan", "Navara"] },
  { make: "Suzuki", models: ["Alto", "Wagon R", "Swift", "Spacia", "Hustler", "Every", "Celerio"] },
  { make: "Mitsubishi", models: ["Montero", "Outlander", "Pajero", "L200", "Lancer"] },
  { make: "Mazda", models: ["Axela", "Demio", "CX-5", "Bongo"] },
  { make: "Hyundai", models: ["Tucson", "Santa Fe", "Elantra", "Grand i10"] },
  { make: "Kia", models: ["Sportage", "Sorento", "Picanto"] },
  { make: "Caterpillar", models: ["320D", "312", "D6", "424B"], machinery: true },
  { make: "Komatsu", models: ["PC200", "PC130", "D65"], machinery: true },
  { make: "JCB", models: ["3CX", "4CX", "JS205"], machinery: true },
  { make: "Hitachi", models: ["ZX200", "ZX130"], machinery: true },
];

// Popular list + catalogue counts. Makes with stock come first.
export function mergeModels(catalogue: MakeEntry[]): MakeEntry[] {
  const byMake = new Map<string, MakeEntry>();
  for (const entry of POPULAR) {
    byMake.set(entry.make.toLowerCase(), {
      make: entry.make,
      vehicles: 0,
      parts: 0,
      machinery: entry.machinery,
      models: entry.models.map((model) => ({ model, vehicles: 0, parts: 0 })),
    });
  }
  for (const entry of catalogue) {
    const known = byMake.get(entry.make.toLowerCase());
    if (!known) {
      byMake.set(entry.make.toLowerCase(), { ...entry, models: [...entry.models] });
      continue;
    }
    known.vehicles += entry.vehicles;
    known.parts += entry.parts;
    for (const model of entry.models) {
      const existing = known.models.find((each) => each.model.toLowerCase() == model.model.toLowerCase());
      if (existing) {
        existing.vehicles += model.vehicles;
        existing.parts += model.parts;
      } else {
        known.models.push({ ...model });
      }
    }
  }
  const stock = (entry: { vehicles: number; parts: number }) => entry.vehicles + entry.parts;
  return [...byMake.values()]
    .map((entry) => ({ ...entry, models: [...entry.models].sort((a, b) => stock(b) - stock(a)) }))
    .sort((a, b) => stock(b) - stock(a) || Number(a.machinery ?? false) - Number(b.machinery ?? false));
}

// "Toyota Aqua" -> ["Toyota", "Aqua"]
export function splitFits(fits: string): [string, string] {
  const [make, ...model] = fits.trim().split(/\s+/);
  return [make ?? "", model.join(" ")];
}

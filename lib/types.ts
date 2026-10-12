// Shapes returned by the backend API. Kept to the fields the website uses.
// Decimal columns (price, total ...) arrive as strings.

export type Role = "CUSTOMER" | "STAFF" | "FINANCE" | "ADMIN" | "SUPPLIER";

export type Division =
  | "TRAVEL"
  | "EVENTS"
  | "GEMS"
  | "VEHICLES"
  | "IMPORT"
  | "EXPORT";

export type PricingMode = "FIXED" | "ON_REQUEST";
export type Availability = "AVAILABLE" | "RESERVED" | "SOLD";

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  privileges: string[];
  divisions: Division[];
}

export interface Pagination {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

// ─────────────── Public catalogue ───────────────

export interface Tour {
  id: string;
  slug: string;
  title: string;
  tourType: "OUTBOUND" | "INBOUND";
  destination: string;
  summary: string;
  itinerary: { day?: number; title?: string; description?: string }[] | null;
  durationDays: number;
  departureDates: string[];
  isCustomisable: boolean;
  inclusions: string[];
  exclusions: string[];
  minGroupSize: number | null;
  maxGroupSize: number | null;
  pricingMode: PricingMode;
  price: string | null;
  currency: string | null;
  images: string[];
}

export interface EventItem {
  id: string;
  slug: string;
  name: string;
  eventType: string;
  description: string;
  venue: string;
  city: string | null;
  country: string | null;
  startDate: string;
  endDate: string;
  organiser: string | null;
  capacity: number | null;
  registrationOpen: boolean;
  fee: string | null;
  currency: string | null;
  terms: string | null;
  images: string[];
  seatsLeft: number | null;
}

export interface PublicDocument {
  id: string;
  type: string;
  title: string;
  fileName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface GemItem {
  id: string;
  sku: string;
  name: string;
  itemType: "GEMSTONE" | "JEWELLERY";
  category: string;
  description: string;
  weight: string | null;
  weightUnit: string;
  colour: string | null;
  cut: string | null;
  shape: string | null;
  clarity: string | null;
  origin: string | null;
  treatment: string | null;
  metal: string | null;
  pricingMode: PricingMode;
  price: string | null;
  currency: string | null;
  availability: Availability;
  images: string[];
  certificates?: PublicDocument[];
}

export interface Vehicle {
  id: string;
  sku: string;
  listingType: "NEW_VEHICLE" | "USED_VEHICLE" | "SPARE_PART" | "HEAVY_MACHINERY";
  title: string;
  description: string;
  make: string | null;
  model: string | null;
  year: number | null;
  condition: string | null;
  mileageKm: number | null;
  operatingHours: number | null;
  fuelType: string | null;
  transmission: string | null;
  partNumber: string | null;
  compatibleWith: string[];
  specifications: Record<string, unknown> | null;
  stock: number;
  pricingMode: PricingMode;
  price: string | null;
  currency: string | null;
  availability: Availability;
  images: string[];
}

export interface TradeProduct {
  id: string;
  sku: string;
  direction: "IMPORT" | "EXPORT";
  category: string;
  name: string;
  description: string;
  origin: string | null;
  specifications: Record<string, unknown> | null;
  packaging: string | null;
  unit: string;
  minimumOrderQty: string | null;
  stockQty: string | null;
  requiresPermit: boolean;
  pricingMode: PricingMode;
  price: string | null;
  currency: string | null;
  images: string[];
}

// ─────────────── Customer account (/api/me/...) ───────────────

export interface MyEnquiry {
  id: string;
  reference: string;
  division: Division;
  serviceType: string | null;
  subject: string;
  status: string;
  createdAt: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: string;
  unit: string;
  unitPrice: string;
  lineTotal: string;
}

export interface MyQuotation {
  id: string;
  reference: string;
  division: Division;
  status: string;
  currency: string;
  subtotal: string;
  discount: string;
  tax: string;
  total: string;
  validUntil: string;
  terms: string | null;
  shippingTerms: string | null;
  notes: string | null;
  createdAt: string;
  items: LineItem[];
}

export interface MyOrder {
  id: string;
  reference: string;
  division: Division;
  status: string;
  currency: string;
  total: string;
  amountPaid: string;
  createdAt: string;
  items: LineItem[];
  shipments: {
    id: string;
    reference: string;
    status: string;
    carrier: string | null;
    trackingNumber: string | null;
    origin: string | null;
    destination: string | null;
    expectedArrival: string | null;
    isDelayed: boolean;
    delayReason: string | null;
    milestones: {
      id: string;
      status: string;
      location: string | null;
      note: string | null;
      occurredAt: string;
    }[];
  }[];
}

export interface MyPayment {
  id: string;
  reference: string;
  amount: string;
  currency: string;
  method: string;
  status: string;
  paidAt: string | null;
  createdAt: string;
  order: { reference: string };
}

export interface MyDocument extends PublicDocument {
  division: Division | null;
}

export interface MyEventRegistration {
  id: string;
  reference: string;
  seats: number;
  status: string;
  createdAt: string;
  event: {
    id: string;
    slug: string;
    name: string;
    venue: string;
    startDate: string;
    endDate: string;
  };
}

export interface MyMessage {
  id: string;
  channel: string;
  subject: string | null;
  body: string;
  status: string;
  createdAt: string;
}

export interface MyTravel {
  visaCases: {
    id: string;
    reference: string;
    destinationCountry: string;
    visaType: string;
    stage: string;
    decision: string | null;
    createdAt: string;
  }[];
  tickets: {
    id: string;
    reference: string;
    tripType: string;
    passengerCount: number;
    status: string;
    airline: string | null;
    pnr: string | null;
    createdAt: string;
  }[];
  insurance: {
    id: string;
    reference: string;
    destination: string;
    startDate: string;
    endDate: string;
    status: string;
    policyNumber: string | null;
    createdAt: string;
  }[];
}

// Rentals: shared labels and date helpers (server and client components)

export const RENTAL_EVENT_TYPES = [
  { value: "WEDDING", label: "Wedding" },
  { value: "FUNERAL", label: "Funeral" },
  { value: "BIRTHDAY", label: "Birthday" },
  { value: "RELIGIOUS", label: "Religious ceremony / dana" },
  { value: "CORPORATE", label: "Corporate event" },
  { value: "PARTY", label: "Party" },
  { value: "OTHER", label: "Other event" },
];

export function eventTypeLabel(value: string) {
  return RENTAL_EVENT_TYPES.find((type) => type.value == value)?.label ?? value;
}

// Rentals are whole calendar days, stored as midnight UTC - shown in UTC
// so a visitor's time zone never moves them to another day.
export function formatRentalDay(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatRentalDates(start: string, end: string) {
  return start.slice(0, 10) == end.slice(0, 10)
    ? formatRentalDay(start)
    : `${formatRentalDay(start)} - ${formatRentalDay(end)}`;
}

// "2026-11-14" + "2026-11-15" -> 2 (both days count)
export function rentalDayCount(from: string, to: string) {
  if (!from || !to || to < from) {
    return 0;
  }
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000) + 1;
}

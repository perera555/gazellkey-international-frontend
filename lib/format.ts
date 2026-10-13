// Display helpers shared by pages and client components

type Amount = number | string | null | undefined;

export function formatMoney(amount: Amount, currency: string | null | undefined) {
  if (amount == null || currency == null) {
    return "";
  }
  try {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 2,
    }).format(Number(amount));
  } catch {
    return `${currency} ${Number(amount).toFixed(2)}`;
  }
}

// "Price on request" listings have no public price (SRS 1.4)
export function priceLabel(item: {
  pricingMode?: string;
  price?: Amount;
  currency?: string | null;
}) {
  if (item.pricingMode == "FIXED" && item.price != null && item.currency) {
    return formatMoney(item.price, item.currency);
  }
  return "Price on request";
}

export function formatDate(value: Date | string | null | undefined) {
  if (value == null) {
    return "";
  }
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: Date | string | null | undefined) {
  if (value == null) {
    return "";
  }
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// "12 Mar 2026" or "12 Mar 2026 - 14 Mar 2026"
export function formatDateRange(start: string, end: string) {
  const from = formatDate(start);
  const to = formatDate(end);
  return from == to ? from : `${from} - ${to}`;
}

// Appointments are in office time (Sri Lanka), wherever the visitor is
export const OFFICE_TIME_ZONE = "Asia/Colombo";

export const APPOINTMENT_MODES = [
  { value: "IN_PERSON", label: "Office visit", text: "Meet us at our office" },
  { value: "PHONE", label: "Phone call", text: "We call you" },
  { value: "VIDEO", label: "Video call", text: "Online meeting" },
] as const;

export function modeLabel(mode: string) {
  return APPOINTMENT_MODES.find((item) => item.value == mode)?.label ?? humanize(mode);
}

// "Thursday, 15 October 2026"
export function formatOfficeDay(value: Date | string) {
  return new Date(value).toLocaleDateString("en-GB", {
    timeZone: OFFICE_TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// "09:30"
export function formatOfficeClock(value: Date | string) {
  return new Date(value).toLocaleTimeString("en-GB", {
    timeZone: OFFICE_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  });
}

// "2026-10-15" of a moment, in office time (for <input type="date">)
export function officeDay(value: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: OFFICE_TIME_ZONE }).format(value);
}

// "AWAITING_CUSTOMER" -> "Awaiting customer"
export function humanize(value: string | null | undefined) {
  if (!value) {
    return "";
  }
  const text = value.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// Search params come as string | string[] | undefined; keep only strings
export function param(value: string | string[] | undefined) {
  return typeof value == "string" ? value : undefined;
}

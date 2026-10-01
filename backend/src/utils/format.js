import { DEFAULT_TIME_SLOTS } from "./constants.js";

export function formatBookingDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatBookingTime(value) {
  const match = DEFAULT_TIME_SLOTS.find((s) => s.value === value);
  return match ? match.label : value;
}

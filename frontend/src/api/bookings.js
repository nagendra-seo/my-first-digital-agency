import { apiFetch } from "./client.js";

export function createBooking(payload) {
  return apiFetch("/bookings", { method: "POST", body: JSON.stringify(payload) });
}

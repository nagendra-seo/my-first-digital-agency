import { apiFetch } from "./client.js";

export const login = (email, password) =>
  apiFetch("/admin/login", { method: "POST", body: JSON.stringify({ email, password }) });

export const verify2fa = (code) =>
  apiFetch("/admin/login/verify-2fa", { method: "POST", body: JSON.stringify({ code }) });

export const logout = () => apiFetch("/admin/logout", { method: "POST" });

export const getSessionStatus = () => apiFetch("/admin/session");

export const listSessions = () => apiFetch("/admin/sessions");
export const revokeSession = (id) => apiFetch(`/admin/sessions/${id}`, { method: "DELETE" });

export const getDashboardStats = () => apiFetch("/admin/dashboard");

export const getOverview = () => apiFetch("/admin/settings/overview");
export const setup2fa = () => apiFetch("/admin/settings/2fa/setup", { method: "POST" });
export const verify2faSetup = (code) =>
  apiFetch("/admin/settings/2fa/verify", { method: "POST", body: JSON.stringify({ code }) });
export const toggleTimeSlot = (id) => apiFetch(`/admin/settings/time-slots/${id}/toggle`, { method: "POST" });

export function listBookings(params) {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/admin/bookings?${qs}`);
}
export const getBooking = (id) => apiFetch(`/admin/bookings/${id}`);
export const confirmBooking = (id) => apiFetch(`/admin/bookings/${id}/confirm`, { method: "POST" });
export const cancelBooking = (id, reason) =>
  apiFetch(`/admin/bookings/${id}/cancel`, { method: "POST", body: JSON.stringify({ reason }) });
export const rescheduleBooking = (id, payload) =>
  apiFetch(`/admin/bookings/${id}/reschedule`, { method: "POST", body: JSON.stringify(payload) });
export const completeBooking = (id) => apiFetch(`/admin/bookings/${id}/complete`, { method: "POST" });
export const updateNotes = (id, adminNotes) =>
  apiFetch(`/admin/bookings/${id}/notes`, { method: "POST", body: JSON.stringify({ adminNotes }) });

export function exportBookingsUrl(params) {
  const qs = new URLSearchParams(params).toString();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  return `${API_URL}/admin/bookings/export?${qs}`;
}

export function listActivity(page) {
  return apiFetch(`/admin/activity?page=${page}`);
}

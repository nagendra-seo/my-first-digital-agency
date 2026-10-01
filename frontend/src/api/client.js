const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function readCsrfCookie() {
  const match = document.cookie.match(/(?:^|; )mfa_csrf=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/** Thin fetch wrapper shared by every API call in the app.
 *  - Always sends/receives cookies (credentials: "include") so the
 *    httpOnly session cookie works across the frontend/backend origins.
 *  - Echoes the CSRF cookie back as a header on any non-GET request.
 *  - Never logs to the console — callers receive a plain { ok, data|error }
 *    result and decide how to show it in the UI. */
export async function apiFetch(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };

  if (method !== "GET") {
    const csrfToken = readCsrfCookie();
    if (csrfToken) headers["x-csrf-token"] = csrfToken;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: "include" });
  } catch {
    return { ok: false, status: 0, error: "We couldn't reach the server. Please check your connection." };
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    return { ok: false, status: res.status, error: data?.error || "Something went wrong.", fieldErrors: data?.fieldErrors };
  }
  return { ok: true, status: res.status, data };
}

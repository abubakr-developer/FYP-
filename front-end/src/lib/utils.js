import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const BASE_URL = "/api/university";

export async function apiFetch(endpoint, options = {}) {
  // Try multiple possible token keys – university portal often uses different key
  let token =
    localStorage.getItem("universityToken") ||
    localStorage.getItem("uniToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");

  console.log(`apiFetch → ${endpoint} | Token found? ${!!token} (key used: ${token ? 'found' : 'none'})`);

  const defaultHeaders = {};

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  } else {
    console.warn("No token found in localStorage for apiFetch");
  }

  // ────────────────────────────────────────────────
  // Rest of your existing code (FormData handling, headers merge, fetch, etc.)
  // Keep everything below unchanged
  // ────────────────────────────────────────────────

  const isFormData = options.body instanceof FormData;

  let headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  if (isFormData) {
    delete headers["Content-Type"];
  } else if (!headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  try {
    const response = await fetch(`${BASE_URL}${normalizedEndpoint}`, {
      ...options,
      headers,
    });

    let data;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      data = await response.json().catch(() => ({}));
    } else {
      data = { message: await response.text().catch(() => "") };
    }

    if (!response.ok) {
      const message = data.message || data.error || `Server error (${response.status})`;
      throw new Error(message);
    }

    return data;
  } catch (error) {
    console.error(`apiFetch failed for ${endpoint}:`, error.message);
    throw error;
  }
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
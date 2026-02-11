import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const BASE_URL = "/api/university";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  // Default headers — only apply Content-Type for JSON by default
  const defaultHeaders = {};

  // Add Authorization if token exists (safe for both JSON and FormData)
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  // Detect if we're sending FormData (file upload)
  const isFormData = options.body instanceof FormData;

  // Build final headers
  let headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  // Critical: Do NOT set Content-Type when using FormData
  // Let the browser set multipart/form-data + boundary automatically
  if (isFormData) {
    delete headers["Content-Type"];
  } else if (!headers["Content-Type"]) {
    // Only set JSON for non-FormData bodies
    headers["Content-Type"] = "application/json";
  }

  // Normalize endpoint (add leading slash if missing)
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  try {
    const response = await fetch(`${BASE_URL}${normalizedEndpoint}`, {
      ...options,
      headers,
      // Optional: include credentials if using cookies/sessions instead of token
      // credentials: "include",
    });

    // Handle non-JSON responses gracefully (e.g., empty 204, text errors, etc.)
    let data;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      data = await response.json().catch(() => ({}));
    } else {
      // Fallback for non-JSON (rare in your case)
      data = { message: await response.text().catch(() => "") };
    }

    if (!response.ok) {
      const message = data.message || data.error || `Server error (${response.status})`;
      throw new Error(message);
    }

    return data;
  } catch (error) {
    // Log for debugging (you can remove in production)
    console.error(`apiFetch failed for ${endpoint}:`, error.message);
    throw error; // Let caller (e.g. toast) handle it
  }
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
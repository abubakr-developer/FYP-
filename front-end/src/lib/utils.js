import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";


const BASE_URL = "/api/university";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");   // ← adjust key if different

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const message = data.message || `Server error (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

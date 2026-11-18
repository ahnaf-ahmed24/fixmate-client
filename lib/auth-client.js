"use client";

import { createAuthClient } from "better-auth/react";
import { API_URL } from "./constants";


export const authClient = createAuthClient({
  baseURL: API_URL,
  fetchOptions: {
    credentials: "include",
  },
});


export async function fetchJwtToken() {
  try {
    const res = await fetch(`${API_URL}/api/auth/token`, { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.token || null;
  } catch {
    return null;
  }
}

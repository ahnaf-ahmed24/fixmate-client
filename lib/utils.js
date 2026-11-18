import { API_URL } from "./constants";


let memoryToken = null;

export function getToken() {
  return memoryToken;
}

export function setToken(token) {
  memoryToken = token || null;
}


export async function api(path, { method = "GET", body, token } = {}) {
  const t = token ?? getToken();
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    return { ok: false, status: 0, data: null, message: "Network error — is the server running?" };
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }

  return {
    ok: res.ok,
    status: res.status,
    data: data?.data !== undefined ? data.data : data,
    message: data?.message || (res.ok ? "Success" : `Request failed (${res.status})`),
    raw: data,
  };
}

import { getToken } from "../auth/auth";

export const API_BASE_URL = "https://localhost:7019";

export async function apiGet<T>(path: string): Promise<T> {
  const headers = createHeaders();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${path} failed: ${res.status} ${res.statusText} ${text}`);
  }

  return (await res.json()) as T;
}

export async function apiPost<TResponse, TBody>(path: string, body: TBody): Promise<TResponse> {
  const headers = createHeaders();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`POST ${path} failed: ${res.status} ${res.statusText} ${text}`);
  }

  return (await res.json()) as TResponse;
}

function createHeaders(): HeadersInit{
  const authToken = getToken();

  let headers: HeadersInit = {
  "Content-Type": "application/json",
  };

  if (authToken){
    headers = {
      ...headers,
      "Authorization": "Bearer " + authToken
    }
  }

  return headers;
}
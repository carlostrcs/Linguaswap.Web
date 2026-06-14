const TOKEN_STORAGE_KEY = "linguaswap.token";

type JwtPayload = {
  exp?: number;
};

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY,token);
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
}

function decodeBase64Url(value: string) {
  let base64 = value.replace(/-/g, "+").replace(/_/g, "/");

  const padding = base64.length % 4;

  if (padding > 0) {
    base64 += "=".repeat(4 - padding);
  }

  return atob(base64);
}

function getJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const json = decodeBase64Url(payload);

    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string) {
  const payload = getJwtPayload(token);

  if (!payload?.exp) {
    return true;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);

  return payload.exp <= nowInSeconds;
}

export function getValidToken() {
  const token = getToken();

  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    clearToken();
    return null;
  }

  return token;
}

export function isAuthenticated() {
  return getValidToken() !== null;
}
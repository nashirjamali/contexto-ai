import { getToken, clearToken } from "@/lib/auth/session";
import type { ApiError } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export class ApiClientError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

async function parseError(res: Response): Promise<ApiError> {
  try {
    const data = await res.json();
    const message = Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message ?? res.statusText;
    return { message, statusCode: res.status };
  } catch {
    return { message: res.statusText, statusCode: res.status };
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type") &&
    options.body
  ) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiClientError("Unauthorized", 401);
  }

  if (!res.ok) {
    const err = await parseError(res);
    throw new ApiClientError(err.message, err.statusCode);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export async function apiPublic<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await parseError(res);
    throw new ApiClientError(err.message, err.statusCode);
  }

  return res.json() as Promise<T>;
}

import { api } from "@/lib/api/client";
import type { AuthResponse, User } from "@/lib/types";

export function register(data: {
  name: string;
  email: string;
  password: string;
}) {
  return api<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function login(data: { email: string; password: string }) {
  return api<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function logout() {
  return api<{ success: boolean }>("/auth/logout", { method: "POST" });
}

export function getMe() {
  return api<User>("/auth/me");
}

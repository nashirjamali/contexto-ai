const TOKEN_KEY = "contexto_token";
const WORKSPACE_KEY = "contexto_workspace";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `contexto_token=${token}; path=/; max-age=604800; SameSite=Lax`;
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = "contexto_token=; path=/; max-age=0";
}

export function getActiveWorkspaceId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(WORKSPACE_KEY);
}

export function setActiveWorkspaceId(id: string): void {
  localStorage.setItem(WORKSPACE_KEY, id);
}

export function clearActiveWorkspaceId(): void {
  localStorage.removeItem(WORKSPACE_KEY);
}

export function getConversationKey(documentId: string): string {
  return `contexto_conversation_${documentId}`;
}

export function getStoredConversationId(documentId: string): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(getConversationKey(documentId));
}

export function setStoredConversationId(
  documentId: string,
  conversationId: string,
): void {
  sessionStorage.setItem(getConversationKey(documentId), conversationId);
}

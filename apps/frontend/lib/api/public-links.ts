import { api, apiPublic } from "@/lib/api/client";
import type { PublicDocumentInfo, PublicLink, RagAnswer } from "@/lib/types";

export function createPublicLink(
  documentId: string,
  data?: { expiresAt?: string },
) {
  return api<PublicLink>(`/documents/${documentId}/public-link`, {
    method: "POST",
    body: JSON.stringify(data ?? {}),
  });
}

export function updatePublicLink(
  id: string,
  data: { enabled?: boolean; expiresAt?: string },
) {
  return api<PublicLink>(`/public-links/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deletePublicLink(id: string) {
  return api(`/public-links/${id}`, { method: "DELETE" });
}

export function getPublicDocument(slug: string) {
  return apiPublic<PublicDocumentInfo>(`/public/${slug}`);
}

export function sendPublicMessage(slug: string, content: string) {
  return apiPublic<RagAnswer>(`/public/${slug}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

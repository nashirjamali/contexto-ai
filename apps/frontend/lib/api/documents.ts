import { api } from "@/lib/api/client";
import type { Document, DocumentStatusResponse } from "@/lib/types";

export function listDocuments(workspaceId: string) {
  return api<Document[]>(`/workspaces/${workspaceId}/documents`);
}

export function getDocument(id: string) {
  return api<Document>(`/documents/${id}`);
}

export function getDocumentStatus(id: string) {
  return api<DocumentStatusResponse>(`/documents/${id}/status`);
}

export function uploadDocument(
  workspaceId: string,
  file: File,
  title: string,
) {
  const form = new FormData();
  form.append("file", file);
  form.append("title", title);
  return api<Document>(`/workspaces/${workspaceId}/documents`, {
    method: "POST",
    body: form,
  });
}

export function deleteDocument(id: string) {
  return api(`/documents/${id}`, { method: "DELETE" });
}

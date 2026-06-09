import { api } from "@/lib/api/client";
import type { MembershipRole, Workspace } from "@/lib/types";

export function listWorkspaces() {
  return api<Workspace[]>("/workspaces");
}

export function getWorkspace(id: string) {
  return api<Workspace>(`/workspaces/${id}`);
}

export function createWorkspace(data: { name: string }) {
  return api<Workspace>("/workspaces", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function addMember(
  workspaceId: string,
  data: { email: string; role: MembershipRole },
) {
  return api(`/workspaces/${workspaceId}/members`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateMember(
  workspaceId: string,
  userId: string,
  data: { role: MembershipRole },
) {
  return api(`/workspaces/${workspaceId}/members/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function removeMember(workspaceId: string, userId: string) {
  return api(`/workspaces/${workspaceId}/members/${userId}`, {
    method: "DELETE",
  });
}

export function deleteWorkspace(workspaceId: string) {
  return api(`/workspaces/${workspaceId}`, {
    method: "DELETE",
  });
}

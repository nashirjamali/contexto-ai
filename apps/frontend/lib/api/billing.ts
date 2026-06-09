import { api } from "@/lib/api/client";
import type { Plan, UsageRecord } from "@/lib/types";

export function getUsage(workspaceId: string) {
  return api<{ organizationId: string; plan: Plan; records: UsageRecord[] }>(
    `/billing/usage?workspaceId=${workspaceId}`,
  );
}

export function createCheckout(workspaceId: string, plan: Plan) {
  return api<{ url: string }>("/billing/checkout", {
    method: "POST",
    body: JSON.stringify({ workspaceId, plan }),
  });
}

export function createPortal(workspaceId: string) {
  return api<{ url: string }>("/billing/portal", {
    method: "POST",
    body: JSON.stringify({ workspaceId }),
  });
}

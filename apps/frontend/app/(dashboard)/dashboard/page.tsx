"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { listWorkspaces } from "@/lib/api/workspaces";
import { getActiveWorkspaceId, setActiveWorkspaceId } from "@/lib/auth/session";

export default function DashboardPage() {
  const router = useRouter();
  const { data: workspaces, isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: listWorkspaces,
  });

  useEffect(() => {
    if (isLoading || !workspaces) return;

    if (workspaces.length === 0) {
      router.replace("/workspaces");
      return;
    }

    const stored = getActiveWorkspaceId();
    const target = workspaces.find((w) => w.id === stored) ?? workspaces[0];
    setActiveWorkspaceId(target.id);
    router.replace(`/workspaces/${target.id}`);
  }, [workspaces, isLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-paper-muted">Loading workspace…</p>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { listWorkspaces } from "@/lib/api/workspaces";
import { setActiveWorkspaceId } from "@/lib/auth/session";
import { Select } from "@/components/ui/select";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface WorkspaceSwitcherProps {
  currentId?: string;
}

export function WorkspaceSwitcher({ currentId }: WorkspaceSwitcherProps) {
  const router = useRouter();
  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: listWorkspaces,
  });

  if (isLoading) {
    return <div className="h-10 animate-pulse rounded-sm bg-surface-raised" />;
  }

  if (workspaces.length === 0) {
    return (
      <Link href="/workspaces">
        <Button variant="ghost" className="w-full text-xs">
          Create workspace
        </Button>
      </Link>
    );
  }

  return (
    <Select
      label="Workspace"
      value={currentId ?? ""}
      onChange={(e) => {
        const id = e.target.value;
        setActiveWorkspaceId(id);
        router.push(`/workspaces/${id}`);
      }}
    >
      {workspaces.map((ws) => (
        <option key={ws.id} value={ws.id}>
          {ws.name}
        </option>
      ))}
    </Select>
  );
}

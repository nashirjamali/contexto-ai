"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { deleteWorkspace } from "@/lib/api/workspaces";
import { Button } from "@/components/ui/button";
import {
  clearActiveWorkspaceId,
  getActiveWorkspaceId,
  setActiveWorkspaceId,
} from "@/lib/auth/session";
import type { Workspace } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface WorkspaceListProps {
  workspaces: Workspace[];
}

export function WorkspaceList({ workspaces }: WorkspaceListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: deleteWorkspace,
    onSuccess: (_data, workspaceId) => {
      if (getActiveWorkspaceId() === workspaceId) {
        clearActiveWorkspaceId();
      }
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      router.push("/workspaces");
    },
  });

  if (workspaces.length === 0) {
    return (
      <div className="rounded-sm border border-surface-raised bg-surface p-12 text-center">
        <p className="font-display text-xl text-paper">No workspaces yet</p>
        <p className="mt-2 text-sm text-paper-muted">
          Create your first workspace to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {workspaces.map((ws) => (
        <div
          key={ws.id}
          className="flex items-start justify-between rounded-sm border border-surface-raised bg-surface p-6 transition-colors hover:border-bronze/40"
        >
          <Link
            href={`/workspaces/${ws.id}`}
            onClick={() => setActiveWorkspaceId(ws.id)}
            className="flex-1"
          >
            <p className="font-display text-xl text-paper">{ws.name}</p>
            <p className="mt-2 text-xs text-paper-muted">
              Created {formatDate(ws.createdAt)}
            </p>
          </Link>
          <Button
            variant="ghost"
            className="ml-4 px-2"
            onClick={() => {
              if (
                confirm(
                  `Delete "${ws.name}"? All documents and chat history in this workspace will be permanently removed.`,
                )
              ) {
                remove.mutate(ws.id);
              }
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ))}
    </div>
  );
}

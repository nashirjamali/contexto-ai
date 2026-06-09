"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWorkspace } from "@/lib/api/workspaces";
import { Button } from "@/components/ui/button";
import {
  clearActiveWorkspaceId,
  getActiveWorkspaceId,
} from "@/lib/auth/session";

interface DeleteWorkspaceProps {
  workspaceId: string;
  workspaceName: string;
}

export function DeleteWorkspace({
  workspaceId,
  workspaceName,
}: DeleteWorkspaceProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: () => deleteWorkspace(workspaceId),
    onSuccess: () => {
      if (getActiveWorkspaceId() === workspaceId) {
        clearActiveWorkspaceId();
      }
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      router.push("/workspaces");
    },
  });

  return (
    <div className="rounded-sm border border-ember/30 bg-ember/5 p-6">
      <p className="font-display text-xl text-paper">Delete workspace</p>
      <p className="mt-2 text-sm text-paper-muted">
        Permanently remove {workspaceName}, including all documents, chats, and
        members. This cannot be undone.
      </p>
      <Button
        variant="danger"
        className="mt-4"
        disabled={remove.isPending}
        onClick={() => {
          if (
            confirm(
              `Delete "${workspaceName}"? All documents and chat history will be permanently removed.`,
            )
          ) {
            remove.mutate();
          }
        }}
      >
        {remove.isPending ? "Deleting…" : "Delete workspace"}
      </Button>
    </div>
  );
}

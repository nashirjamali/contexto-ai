"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDocument } from "@/lib/api/documents";
import { StatusBadge } from "@/components/documents/status-badge";
import { Button } from "@/components/ui/button";
import type { Document } from "@/lib/types";
import { formatBytes, formatDate } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface DocumentListProps {
  documents: Document[];
  workspaceId: string;
  canDelete?: boolean;
  currentUserId?: string;
}

export function DocumentList({
  documents,
  workspaceId,
  canDelete = true,
  currentUserId,
}: DocumentListProps) {
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", workspaceId] });
    },
  });

  if (documents.length === 0) {
    return (
      <div className="rounded-sm border border-surface-raised bg-surface p-12 text-center">
        <p className="font-display text-xl text-paper">No documents yet</p>
        <p className="mt-2 text-sm text-paper-muted">
          Upload your first PDF or document to start chatting.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => {
        const canRemove =
          canDelete && (currentUserId === doc.uploadedBy || canDelete);
        return (
          <div
            key={doc.id}
            className="flex items-center justify-between rounded-sm border border-surface-raised bg-surface p-4 transition-colors hover:border-bronze/30"
          >
            <Link
              href={`/workspaces/${workspaceId}/documents/${doc.id}`}
              className="flex-1"
            >
              <p className="font-display text-lg text-paper">{doc.title}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-paper-muted">
                <StatusBadge status={doc.status} />
                <span>{formatBytes(doc.fileSize)}</span>
                <span>{formatDate(doc.createdAt)}</span>
              </div>
            </Link>
            {canRemove && (
              <Button
                variant="ghost"
                className="ml-4 px-2"
                onClick={() => {
                  if (confirm("Delete this document?")) remove.mutate(doc.id);
                }}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

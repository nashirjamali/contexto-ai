"use client";

import { use, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ChatPanel } from "@/components/chat/chat-panel";
import { ShareDialog } from "@/components/public-links/share-dialog";
import { StatusBadge } from "@/components/documents/status-badge";
import { getDocument, getDocumentStatus } from "@/lib/api/documents";
import { setActiveWorkspaceId } from "@/lib/auth/session";
import type { PublicLink } from "@/lib/types";
import { formatBytes, formatDate } from "@/lib/utils";

export default function DocumentPage({
  params,
}: {
  params: Promise<{ id: string; docId: string }>;
}) {
  const { id: workspaceId, docId } = use(params);
  const [publicLink, setPublicLink] = useState<PublicLink | null>(null);

  useEffect(() => {
    setActiveWorkspaceId(workspaceId);
  }, [workspaceId]);

  const { data: document } = useQuery({
    queryKey: ["document", docId],
    queryFn: () => getDocument(docId),
  });

  const { data: status } = useQuery({
    queryKey: ["document-status", docId],
    queryFn: () => getDocumentStatus(docId),
    refetchInterval: (query) => {
      const s = query.state.data?.status;
      if (s === "uploading" || s === "processing") return 3000;
      return false;
    },
  });

  const currentStatus = status?.status ?? document?.status ?? "uploading";
  const chatEnabled = currentStatus === "ready";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar workspaceId={workspaceId} />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Header title={document?.title ?? "Document"} />
        <main className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden p-8">
          <div className="shrink-0 grid grid-cols-2 gap-6">
            {document && (
              <div className="flex h-full min-w-0 flex-col justify-center rounded-sm border border-surface-raised bg-surface p-6">
                <h2 className="font-display text-2xl text-paper">
                  {document.title}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-paper-muted">
                  <StatusBadge status={currentStatus} />
                  <span>{formatBytes(document.fileSize)}</span>
                  <span>{formatDate(document.createdAt)}</span>
                  {status?.pageCount && (
                    <span>{status.pageCount} pages</span>
                  )}
                </div>
              </div>
            )}
            <ShareDialog
              className="h-full"
              documentId={docId}
              link={publicLink}
              onUpdate={(link) => setPublicLink(link)}
            />
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <ChatPanel
              workspaceId={workspaceId}
              documentId={docId}
              disabled={!chatEnabled}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

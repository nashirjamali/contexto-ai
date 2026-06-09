"use client";

import { use } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { DocumentList } from "@/components/documents/document-list";
import { UploadZone } from "@/components/documents/upload-zone";
import { listDocuments, uploadDocument } from "@/lib/api/documents";
import { setActiveWorkspaceId } from "@/lib/auth/session";
import { useAuth } from "@/components/providers/auth-provider";
import { useEffect } from "react";

export default function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    setActiveWorkspaceId(id);
  }, [id]);

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents", id],
    queryFn: () => listDocuments(id),
    refetchInterval: (query) => {
      const docs = query.state.data;
      if (docs?.some((d) => d.status === "uploading" || d.status === "processing")) {
        return 3000;
      }
      return false;
    },
  });

  const upload = useMutation({
    mutationFn: ({ file, title }: { file: File; title: string }) =>
      uploadDocument(id, file, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", id] });
    },
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar workspaceId={id} />
      <div className="flex flex-1 flex-col">
        <Header title="Documents" />
        <main className="flex-1 space-y-8 p-8">
          <UploadZone
            onUpload={async (file, title) => {
              await upload.mutateAsync({ file, title });
            }}
          />
          {isLoading ? (
            <p className="text-paper-muted">Loading documents…</p>
          ) : (
            <DocumentList
              documents={documents}
              workspaceId={id}
              currentUserId={user?.id}
            />
          )}
        </main>
      </div>
    </div>
  );
}

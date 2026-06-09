"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listWorkspaces, createWorkspace } from "@/lib/api/workspaces";
import { WorkspaceList } from "@/components/workspaces/workspace-list";
import { setActiveWorkspaceId } from "@/lib/auth/session";

export default function WorkspacesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: listWorkspaces,
  });

  const create = useMutation({
    mutationFn: () => createWorkspace({ name }),
    onSuccess: (ws) => {
      setActiveWorkspaceId(ws.id);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      router.push(`/workspaces/${ws.id}`);
    },
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header
          title="Workspaces"
          action={
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "New workspace"}
            </Button>
          }
        />
        <main className="flex-1 p-8">
          {showForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (name.trim()) create.mutate();
              }}
              className="mb-8 flex gap-3 rounded-sm border border-surface-raised bg-surface p-6"
            >
              <Input
                label="Workspace name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1"
              />
              <div className="flex items-end">
                <Button type="submit" disabled={create.isPending || !name.trim()}>
                  Create
                </Button>
              </div>
            </form>
          )}

          {isLoading && <p className="text-paper-muted">Loading…</p>}

          {!isLoading && <WorkspaceList workspaces={workspaces} />}
        </main>
      </div>
    </div>
  );
}

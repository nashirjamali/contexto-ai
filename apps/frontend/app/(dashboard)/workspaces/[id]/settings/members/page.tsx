"use client";

import { use, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { InviteForm } from "@/components/members/invite-form";
import { useAuth } from "@/components/providers/auth-provider";
import { setActiveWorkspaceId } from "@/lib/auth/session";

export default function MembersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();

  useEffect(() => {
    setActiveWorkspaceId(id);
  }, [id]);

  return (
    <div className="flex min-h-screen">
      <Sidebar workspaceId={id} />
      <div className="flex flex-1 flex-col">
        <Header title="Members" />
        <main className="max-w-lg space-y-8 p-8">
          <InviteForm workspaceId={id} />
          <div className="rounded-sm border border-surface-raised bg-surface p-6">
            <h3 className="font-display text-lg text-paper">Current member</h3>
            {user && (
              <div className="mt-4 flex items-center justify-between text-sm">
                <div>
                  <p className="text-paper">{user.name}</p>
                  <p className="text-paper-muted">{user.email}</p>
                </div>
                <span className="rounded-full bg-bronze/20 px-2.5 py-0.5 text-xs text-bronze">
                  owner
                </span>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

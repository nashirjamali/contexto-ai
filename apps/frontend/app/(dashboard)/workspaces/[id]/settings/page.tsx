"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { setActiveWorkspaceId } from "@/lib/auth/session";

export default function SettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  useEffect(() => {
    setActiveWorkspaceId(id);
  }, [id]);

  const links = [
    { href: `/workspaces/${id}/settings/members`, label: "Members", desc: "Invite and manage team members" },
    { href: `/workspaces/${id}/settings/billing`, label: "Billing", desc: "Plans, usage, and subscription" },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar workspaceId={id} />
      <div className="flex flex-1 flex-col">
        <Header title="Settings" />
        <main className="p-8">
          <div className="grid gap-4 md:grid-cols-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-sm border border-surface-raised bg-surface p-6 transition-colors hover:border-bronze/40"
              >
                <p className="font-display text-xl text-paper">{l.label}</p>
                <p className="mt-1 text-sm text-paper-muted">{l.desc}</p>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

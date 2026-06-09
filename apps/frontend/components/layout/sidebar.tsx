"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { cn } from "@/lib/utils";
import {
  FileText,
  Settings,
  LogOut,
  Users,
  CreditCard,
} from "lucide-react";

interface SidebarProps {
  workspaceId?: string;
}

export function Sidebar({ workspaceId }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const nav = workspaceId
    ? [
        {
          href: `/workspaces/${workspaceId}`,
          label: "Documents",
          icon: FileText,
        },
        {
          href: `/workspaces/${workspaceId}/settings`,
          label: "Settings",
          icon: Settings,
        },
        {
          href: `/workspaces/${workspaceId}/settings/members`,
          label: "Members",
          icon: Users,
        },
        {
          href: `/workspaces/${workspaceId}/settings/billing`,
          label: "Billing",
          icon: CreditCard,
        },
      ]
    : [];

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-surface-raised bg-surface">
      <div className="border-b border-surface-raised p-5">
        <Link href="/" className="font-display text-xl text-paper">
          Contexto
        </Link>
      </div>

      <div className="p-4">
        <WorkspaceSwitcher currentId={workspaceId} />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {nav.map(({ href, label, icon: Icon }) => {
          const isDocuments = href === `/workspaces/${workspaceId}`;
          const active = isDocuments
            ? pathname === href || pathname.startsWith(`${href}/documents`)
            : pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors",
                active
                  ? "border-l-2 border-bronze bg-surface-raised text-paper"
                  : "text-paper-muted hover:bg-surface-raised hover:text-paper",
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-surface-raised p-4">
        <p className="truncate text-sm text-paper">{user?.name}</p>
        <p className="truncate text-xs text-paper-muted">{user?.email}</p>
        <button
          onClick={logout}
          className="mt-3 flex items-center gap-2 text-sm text-paper-muted transition-colors hover:text-ember"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}

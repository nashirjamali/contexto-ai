"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  createPublicLink,
  updatePublicLink,
  deletePublicLink,
} from "@/lib/api/public-links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PublicLink } from "@/lib/types";
import { publicUrl } from "@/lib/utils";
import { Copy, Link2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareDialogProps {
  documentId: string;
  link?: PublicLink | null;
  onUpdate?: (link: PublicLink | null) => void;
  className?: string;
}

export function ShareDialog({ documentId, link, onUpdate, className }: ShareDialogProps) {
  const [copied, setCopied] = useState("");
  const [expiresAt, setExpiresAt] = useState(link?.expiresAt?.slice(0, 10) ?? "");

  const create = useMutation({
    mutationFn: () => createPublicLink(documentId, expiresAt ? { expiresAt } : undefined),
    onSuccess: (data) => onUpdate?.(data),
  });

  const update = useMutation({
    mutationFn: (data: { enabled?: boolean; expiresAt?: string }) =>
      updatePublicLink(link!.id, data),
    onSuccess: (data) => onUpdate?.(data),
  });

  const remove = useMutation({
    mutationFn: () => deletePublicLink(link!.id),
    onSuccess: () => onUpdate?.(null),
  });

  async function copyLink(slug: string) {
    await navigator.clipboard.writeText(publicUrl(slug));
    setCopied("Link copied!");
    setTimeout(() => setCopied(""), 2000);
  }

  if (!link) {
    return (
      <div className={cn("flex h-full flex-col rounded-sm border border-surface-raised bg-surface p-6", className)}>
        <div className="flex items-center gap-2 text-paper">
          <Link2 size={18} />
          <h3 className="font-display text-lg">Public share link</h3>
        </div>
        <p className="mt-2 text-sm text-paper-muted">
          Create a link for anonymous read-only chat on this document.
        </p>
        <Input
          label="Expiry (optional)"
          type="date"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="mt-4"
        />
        <Button
          className="mt-auto"
          onClick={() => create.mutate()}
          disabled={create.isPending}
        >
          {create.isPending ? "Creating…" : "Create public link"}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex h-full flex-col rounded-sm border border-surface-raised bg-surface p-6", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-paper">Public share link</h3>
        <label className="flex items-center gap-2 text-sm text-paper-muted">
          <input
            type="checkbox"
            checked={link.enabled}
            onChange={(e) => update.mutate({ enabled: e.target.checked })}
          />
          Enabled
        </label>
      </div>
      <div className="mt-4 flex gap-2">
        <input
          readOnly
          value={publicUrl(link.slug)}
          className="flex-1 rounded-sm bg-surface-raised px-3 py-2 text-sm text-paper-muted"
        />
        <Button variant="ghost" onClick={() => copyLink(link.slug)}>
          <Copy size={16} />
        </Button>
      </div>
      {copied && <p className="mt-2 text-xs text-sage">{copied}</p>}
      <Input
        label="Expiry"
        type="date"
        value={expiresAt}
        onChange={(e) => {
          setExpiresAt(e.target.value);
          update.mutate({ expiresAt: e.target.value });
        }}
        className="mt-4"
      />
      <Button
        variant="danger"
        className="mt-auto"
        onClick={() => {
          if (confirm("Revoke this public link?")) remove.mutate();
        }}
      >
        <Trash2 size={14} className="mr-2" />
        Revoke link
      </Button>
    </div>
  );
}

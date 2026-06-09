"use client";

import { cn } from "@/lib/utils";
import type { DocumentStatus } from "@/lib/types";

const config: Record<
  DocumentStatus,
  { label: string; className: string }
> = {
  uploading: {
    label: "Uploading…",
    className: "bg-bronze/20 text-bronze",
  },
  processing: {
    label: "Processing…",
    className: "bg-bronze/20 text-bronze animate-pulse",
  },
  ready: { label: "Ready", className: "bg-sage/20 text-sage" },
  failed: { label: "Failed", className: "bg-ember/20 text-ember" },
};

export function StatusBadge({ status }: { status: DocumentStatus }) {
  const { label, className } = config[status];
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        className,
      )}
    >
      {label}
    </span>
  );
}

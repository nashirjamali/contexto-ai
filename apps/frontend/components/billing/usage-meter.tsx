"use client";

import { PLANS } from "@/lib/types";

interface UsageMeterProps {
  records: { type: string; quantity: number }[];
  plan?: string;
}

export function UsageMeter({ records, plan = "free" }: UsageMeterProps) {
  const planConfig = PLANS.find((p) => p.id === plan) ?? PLANS[0];

  const docs = records
    .filter((r) => r.type === "document_processed")
    .reduce((s, r) => s + r.quantity, 0);
  const queries = records
    .filter((r) => r.type === "query")
    .reduce((s, r) => s + r.quantity, 0);

  const docPct = Math.min(100, (docs / planConfig.documents) * 100);
  const queryPct = Math.min(100, (queries / planConfig.queries) * 100);

  return (
    <div className="space-y-6 rounded-sm border border-surface-raised bg-surface p-6">
      <h3 className="font-display text-lg text-paper">Usage this period</h3>
      <Meter label="Documents" used={docs} limit={planConfig.documents} pct={docPct} />
      <Meter label="Queries" used={queries} limit={planConfig.queries} pct={queryPct} />
      {docPct >= 80 || queryPct >= 80 ? (
        <p className="text-sm text-bronze">
          Approaching plan limits. Consider upgrading your plan.
        </p>
      ) : null}
    </div>
  );
}

function Meter({
  label,
  used,
  limit,
  pct,
}: {
  label: string;
  used: number;
  limit: number;
  pct: number;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-paper-muted">{label}</span>
        <span className="text-paper">
          {used} / {limit}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-raised">
        <div
          className="h-full rounded-full bg-bronze transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

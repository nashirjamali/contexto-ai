"use client";

import { PLANS, type Plan } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  plan: (typeof PLANS)[number];
  current?: boolean;
  onSelect?: (plan: Plan) => void;
  loading?: boolean;
}

export function PlanCard({ plan, current, onSelect, loading }: PlanCardProps) {
  return (
    <div
      className={cn(
        "rounded-sm border p-6 transition-colors",
        current ? "border-bronze bg-bronze/5" : "border-surface-raised bg-surface",
      )}
    >
      <p className="font-display text-xl text-paper">{plan.name}</p>
      <p className="mt-1 text-2xl font-medium text-bronze">{plan.price}</p>
      <ul className="mt-4 space-y-2 text-sm text-paper-muted">
        <li>{plan.documents} documents / month</li>
        <li>{plan.queries} queries / month</li>
      </ul>
      {current ? (
        <p className="mt-4 text-xs uppercase tracking-wider text-sage">Current plan</p>
      ) : (
        onSelect && (
          <Button
            className="mt-4 w-full"
            variant="ghost"
            disabled={loading}
            onClick={() => onSelect(plan.id)}
          >
            Upgrade
          </Button>
        )
      )}
    </div>
  );
}

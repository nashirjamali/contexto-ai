"use client";

import { use, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { PlanCard } from "@/components/billing/plan-card";
import { UsageMeter } from "@/components/billing/usage-meter";
import { Button } from "@/components/ui/button";
import { createCheckout, createPortal, getUsage } from "@/lib/api/billing";
import { setActiveWorkspaceId } from "@/lib/auth/session";
import { PLANS, type Plan } from "@/lib/types";

export default function BillingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <Suspense fallback={<div className="p-8 text-paper-muted">Loading…</div>}>
      <BillingContent workspaceId={id} />
    </Suspense>
  );
}

function BillingContent({ workspaceId }: { workspaceId: string }) {
  const searchParams = useSearchParams();
  const checkoutStatus = searchParams.get("checkout");

  useEffect(() => {
    setActiveWorkspaceId(workspaceId);
  }, [workspaceId]);

  const { data: usage, error: usageError } = useQuery({
    queryKey: ["billing-usage", workspaceId],
    queryFn: () => getUsage(workspaceId),
    retry: false,
  });

  const checkout = useMutation({
    mutationFn: (plan: Plan) => createCheckout(workspaceId, plan),
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
  });

  const portal = useMutation({
    mutationFn: () => createPortal(workspaceId),
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
  });

  const currentPlan: Plan = usage?.plan ?? "free";

  return (
    <div className="flex min-h-screen">
      <Sidebar workspaceId={workspaceId} />
      <div className="flex flex-1 flex-col">
        <Header
          title="Billing"
          action={
            <Button
              variant="ghost"
              onClick={() => portal.mutate()}
              disabled={portal.isPending}
            >
              Manage subscription
            </Button>
          }
        />
        <main className="space-y-8 p-8">
          {checkoutStatus === "success" && (
            <p className="rounded-sm border border-sage/30 bg-sage/10 px-4 py-3 text-sm text-sage">
              Subscription updated successfully.
            </p>
          )}
          {checkoutStatus === "cancel" && (
            <p className="rounded-sm border border-bronze/30 bg-bronze/10 px-4 py-3 text-sm text-bronze">
              Checkout was cancelled.
            </p>
          )}

          {usage ? (
            <UsageMeter records={usage.records} plan={currentPlan} />
          ) : usageError ? (
            <p className="text-sm text-paper-muted">
              Usage data unavailable. Connect billing on the backend to view usage.
            </p>
          ) : (
            <p className="text-paper-muted">Loading usage…</p>
          )}

          <div>
            <h2 className="mb-4 font-display text-xl text-paper">Plans</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {PLANS.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  current={plan.id === currentPlan}
                  loading={checkout.isPending}
                  onSelect={(p) => checkout.mutate(p)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getPublicDocument } from "@/lib/api/public-links";
import { PublicChatPanel } from "@/components/chat/public-chat-panel";

export default function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const { data, isLoading, error } = useQuery({
    queryKey: ["public", slug],
    queryFn: () => getPublicDocument(slug),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="mesh-bg flex min-h-screen items-center justify-center">
        <p className="text-paper-muted">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mesh-bg flex min-h-screen flex-col items-center justify-center px-4">
        <p className="font-display text-2xl text-paper">Link unavailable</p>
        <p className="mt-2 text-sm text-paper-muted">
          This link may be disabled or expired.
        </p>
        <Link href="/" className="mt-6 text-bronze hover:underline">
          Go to Contexto
        </Link>
      </div>
    );
  }

  return (
    <div className="mesh-bg min-h-screen">
      <header className="border-b border-surface-raised px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="font-display text-xl text-paper">
            Contexto
          </Link>
          <p className="text-sm text-paper-muted">Shared document</p>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="font-display text-2xl text-paper">
          {data?.document.title}
        </h1>
        <p className="mt-1 text-sm text-paper-muted">
          Read-only chat · no sign-in required
        </p>
        <div className="mt-6">
          <PublicChatPanel slug={slug} />
        </div>
      </main>
    </div>
  );
}

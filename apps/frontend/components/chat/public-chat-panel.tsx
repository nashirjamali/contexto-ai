"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendPublicMessage } from "@/lib/api/public-links";
import { CitationBlock } from "@/components/chat/citation-block";
import { Button } from "@/components/ui/button";
import type { Citation, RagAnswer } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PublicMessage {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

export function PublicChatPanel({ slug }: { slug: string }) {
  const [messages, setMessages] = useState<PublicMessage[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = useMutation({
    mutationFn: (content: string) => sendPublicMessage(slug, content),
    onSuccess: (answer: RagAnswer) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer.content,
          citations: answer.citations,
        },
      ]);
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, send.isPending]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const content = input.trim();
    setMessages((prev) => [...prev, { role: "user", content }]);
    setInput("");
    send.mutate(content);
  }

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col rounded-sm border border-surface-raised bg-surface">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-sm text-paper-muted">
            Ask a question about this shared document.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-sm px-4 py-3 text-sm",
                m.role === "user" ? "bg-bronze/20 text-paper" : "bg-surface-raised text-paper",
              )}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>
              {m.citations && <CitationBlock citations={m.citations} />}
            </div>
          </div>
        ))}
        {send.isPending && (
          <div className="text-sm text-paper-muted animate-pulse">Thinking…</div>
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="border-t border-surface-raised p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question…"
            disabled={send.isPending}
            className="flex-1 rounded-sm bg-surface-raised px-3 py-2.5 text-sm text-paper outline-none focus:ring-2 focus:ring-bronze/40"
          />
          <Button type="submit" disabled={send.isPending || !input.trim()}>
            Send
          </Button>
        </div>
        {send.error && (
          <p className="mt-2 text-xs text-ember">
            {send.error instanceof Error ? send.error.message : "Failed to send"}
          </p>
        )}
      </form>
    </div>
  );
}

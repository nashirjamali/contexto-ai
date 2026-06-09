"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createConversation,
  listMessages,
  sendMessage,
} from "@/lib/api/conversations";
import {
  getStoredConversationId,
  setStoredConversationId,
} from "@/lib/auth/session";
import { CitationBlock } from "@/components/chat/citation-block";
import { Button } from "@/components/ui/button";
import type { Citation, Message } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChatPanelProps {
  workspaceId: string;
  documentId: string;
  disabled?: boolean;
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const citations = (message.citations ?? []) as Citation[];

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-sm px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-bronze/20 text-paper"
            : "bg-surface-raised text-paper",
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {!isUser && citations.length > 0 && (
          <CitationBlock citations={citations} />
        )}
      </div>
    </div>
  );
}

export function ChatPanel({ workspaceId, documentId, disabled }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    setConversationId(getStoredConversationId(documentId));
  }, [documentId]);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => listMessages(conversationId!),
    enabled: !!conversationId,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useMutation({
    mutationFn: async (content: string) => {
      let convId = conversationId;
      if (!convId) {
        const conv = await createConversation({ workspaceId, documentId });
        convId = conv.id;
        setConversationId(convId);
        setStoredConversationId(documentId, convId);
      }
      await sendMessage(convId, content);
      return convId;
    },
    onSuccess: (convId) => {
      queryClient.invalidateQueries({ queryKey: ["messages", convId] });
      setInput("");
    },
  });

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    await send.mutateAsync(input.trim());
  }

  return (
    <div className="flex h-full min-h-0 flex-col rounded-sm border border-surface-raised bg-surface">
      <div className="shrink-0 border-b border-surface-raised px-4 py-3">
        <p className="font-display text-lg text-paper">Chat</p>
        <p className="text-xs text-paper-muted">Ask questions about this document</p>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {isLoading && (
          <p className="text-sm text-paper-muted">Loading messages…</p>
        )}
        {!isLoading && messages.length === 0 && (
          <p className="text-sm text-paper-muted">
            {disabled
              ? "Chat available when document is ready."
              : "Ask your first question about this document."}
          </p>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {send.isPending && (
          <div className="flex justify-start">
            <div className="rounded-sm bg-surface-raised px-4 py-3 text-sm text-paper-muted animate-pulse">
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="shrink-0 border-t border-surface-raised p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={disabled ? "Document processing…" : "Ask a question…"}
            disabled={disabled || send.isPending}
            className="flex-1 rounded-sm bg-surface-raised px-3 py-2.5 text-sm text-paper outline-none focus:ring-2 focus:ring-bronze/40 disabled:opacity-50"
          />
          <Button type="submit" disabled={disabled || send.isPending || !input.trim()}>
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

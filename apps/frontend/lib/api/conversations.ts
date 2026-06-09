import { api } from "@/lib/api/client";
import type { Conversation, Message } from "@/lib/types";

export function createConversation(data: {
  workspaceId: string;
  documentId?: string;
}) {
  return api<Conversation>("/conversations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function listMessages(conversationId: string) {
  return api<Message[]>(`/conversations/${conversationId}/messages`);
}

export function sendMessage(conversationId: string, content: string) {
  return api<Message>(`/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

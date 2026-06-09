export type MembershipRole = "owner" | "admin" | "member" | "viewer";
export type DocumentStatus = "uploading" | "processing" | "ready" | "failed";
export type Plan = "free" | "pro" | "team";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface Workspace {
  id: string;
  name: string;
  organizationId: string;
  createdAt: string;
}

export interface Document {
  id: string;
  workspaceId: string;
  uploadedBy: string;
  title: string;
  fileUrl: string;
  fileSize: number;
  status: DocumentStatus;
  pageCount: number | null;
  createdAt: string;
}

export interface DocumentStatusResponse {
  id: string;
  status: DocumentStatus;
  pageCount: number | null;
}

export interface Citation {
  documentId: string;
  chunkIndex: number;
  content: string;
  score: number;
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  tokenUsage?: Record<string, unknown>;
  createdAt: string;
}

export interface Conversation {
  id: string;
  workspaceId: string;
  documentId?: string;
  createdBy?: string;
  isPublic: boolean;
  createdAt: string;
}

export interface PublicLink {
  id: string;
  documentId: string;
  slug: string;
  enabled: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export interface UsageRecord {
  id: string;
  organizationId: string;
  type: string;
  quantity: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface PublicDocumentInfo {
  slug: string;
  document: { id: string; title: string };
}

export interface RagAnswer {
  content: string;
  citations: Citation[];
  tokenUsage: { prompt: number; completion: number };
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export const PLANS: {
  id: Plan;
  name: string;
  documents: number;
  queries: number;
  price: string;
}[] = [
  { id: "free", name: "Free", documents: 5, queries: 50, price: "$0" },
  { id: "pro", name: "Pro", documents: 100, queries: 1000, price: "TBD" },
  { id: "team", name: "Team", documents: 500, queries: 5000, price: "TBD" },
];

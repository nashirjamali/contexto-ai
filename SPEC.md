# Contexto — Technical Specification

> AI document intelligence SaaS. A multi-tenant platform where users upload PDFs/docs and chat with them via RAG. Includes team workspaces, usage billing via Stripe, and a shareable public link per document.

---

## 1. Overview

| Field | Value |
| --- | --- |
| Product name | Contexto |
| Type | Multi-tenant B2B SaaS |
| Core value | Upload documents, chat with them using AI (RAG) |
| Keywords | RAG, multi-tenancy, billing |

### Elevator pitch

Contexto lets teams turn their documents into a conversational knowledge base. Upload PDFs and docs into a shared workspace, then ask questions in natural language and get cited answers grounded in the source content. Teams collaborate in workspaces, pay based on usage through Stripe, and can publish any document behind a shareable public link.

---

## 2. Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 15 (App Router, React Server Components) |
| Backend API | NestJS |
| Language | TypeScript (end to end) |
| Primary database | PostgreSQL |
| Vector database | Pinecone |
| AI / LLM | OpenRouter API (chat + embeddings) |
| Billing | Stripe |

---

## 3. Core Features

### 3.1 Document ingestion & RAG
- Upload PDFs and document files.
- Parse, chunk, and embed content; store vectors in Pinecone.
- Chat interface that retrieves relevant chunks and answers with citations to the source.

### 3.2 Multi-tenancy & team workspaces
- Organizations (tenants) own workspaces.
- Users belong to one or more workspaces with roles.
- Strict data isolation between tenants at the database and vector-store level.

### 3.3 Usage billing via Stripe
- Metered usage (documents processed, tokens / queries).
- Subscription plans with included quotas plus overage.
- Stripe Checkout, Customer Portal, and webhook-driven state sync.

### 3.4 Shareable public document links
- Per-document public link that can be enabled/disabled.
- Public read-only chat against a single document, no login required.
- Optional expiry and link revocation.

---

## 4. User Roles & Permissions

| Role | Capabilities |
| --- | --- |
| Owner | Full control: billing, workspace settings, members, documents |
| Admin | Manage members and documents, no billing access |
| Member | Upload documents, chat, manage own documents |
| Viewer | Read-only chat access to workspace documents |
| Public (anonymous) | Chat with a single document via an active public link only |

---

## 5. Data Model (PostgreSQL)

```
organizations
  id (uuid, pk)
  name
  stripe_customer_id
  plan
  created_at

workspaces
  id (uuid, pk)
  organization_id (fk -> organizations.id)
  name
  created_at

users
  id (uuid, pk)
  email (unique)
  name
  password_hash | oauth_provider
  created_at

memberships
  id (uuid, pk)
  user_id (fk -> users.id)
  workspace_id (fk -> workspaces.id)
  role (owner | admin | member | viewer)
  created_at

documents
  id (uuid, pk)
  workspace_id (fk -> workspaces.id)
  uploaded_by (fk -> users.id)
  title
  file_url
  file_size
  status (uploading | processing | ready | failed)
  page_count
  created_at

document_chunks
  id (uuid, pk)
  document_id (fk -> documents.id)
  chunk_index
  content
  token_count
  pinecone_vector_id

conversations
  id (uuid, pk)
  workspace_id (fk -> workspaces.id)
  document_id (fk -> documents.id, nullable)
  created_by (fk -> users.id, nullable)
  is_public (bool)
  created_at

messages
  id (uuid, pk)
  conversation_id (fk -> conversations.id)
  role (user | assistant)
  content
  citations (jsonb)
  token_usage (jsonb)
  created_at

public_links
  id (uuid, pk)
  document_id (fk -> documents.id)
  slug (unique)
  enabled (bool)
  expires_at (nullable)
  created_at

usage_records
  id (uuid, pk)
  organization_id (fk -> organizations.id)
  type (document_processed | query | tokens)
  quantity
  metadata (jsonb)
  created_at
```

### Tenant isolation
- Every workspace-scoped query is filtered by `workspace_id`.
- Pinecone vectors are namespaced per workspace (e.g. namespace = `workspace_id`).
- Public links resolve to a single document and bypass workspace auth but stay read-only and document-scoped.

---

## 6. API Surface (NestJS)

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Workspaces & members
- `GET /workspaces`
- `POST /workspaces`
- `GET /workspaces/:id`
- `POST /workspaces/:id/members`
- `PATCH /workspaces/:id/members/:userId`
- `DELETE /workspaces/:id/members/:userId`

### Documents
- `POST /workspaces/:id/documents` (upload)
- `GET /workspaces/:id/documents`
- `GET /documents/:id`
- `DELETE /documents/:id`
- `GET /documents/:id/status` (ingestion progress)

### Chat / RAG
- `POST /conversations`
- `POST /conversations/:id/messages` (ask question, returns answer + citations)
- `GET /conversations/:id/messages`

### Public links
- `POST /documents/:id/public-link`
- `PATCH /public-links/:id` (enable/disable, expiry)
- `DELETE /public-links/:id`
- `GET /public/:slug` (public document metadata)
- `POST /public/:slug/messages` (anonymous chat)

### Billing
- `POST /billing/checkout` (create Stripe Checkout session)
- `POST /billing/portal` (create Customer Portal session)
- `GET /billing/usage`
- `POST /billing/webhook` (Stripe webhook handler)

---

## 7. RAG Pipeline

1. **Upload** — File stored (object storage); `documents` row created with `status = uploading`.
2. **Parse** — Extract text per page.
3. **Chunk** — Split into overlapping chunks with token counts.
4. **Embed** — Call OpenRouter embeddings for each chunk.
5. **Index** — Upsert vectors into Pinecone under the workspace namespace; persist chunk metadata in PostgreSQL.
6. **Ready** — `status = ready`.
7. **Query** — On a user question: embed query → Pinecone similarity search (scoped to namespace/document) → assemble context → OpenRouter chat completion → return answer with citations.

Ingestion runs as an async background job so uploads don't block the request.

---

## 8. Billing Model (Stripe)

- **Plans:** Free, Pro, Team (each with included document and query quotas).
- **Metered usage:** Overage billed per document processed and per query/token block.
- **Flow:** Checkout for subscription → webhooks keep `organizations.plan` and `stripe_customer_id` in sync → Customer Portal for self-serve management.
- **Enforcement:** Usage checked against plan quota before processing documents and running queries; soft limits warn, hard limits block until upgrade.

### Key Stripe webhooks
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

---

## 9. Non-Functional Requirements

| Area | Requirement |
| --- | --- |
| Security | Tenant data isolation, signed upload URLs, encrypted secrets, rate limiting |
| Auth | JWT/session auth; role-based access control per workspace |
| Scalability | Async ingestion jobs; stateless API; Pinecone for vector scale |
| Observability | Structured logs, request tracing, usage metering audit trail |
| Reliability | Idempotent webhook handling; retryable ingestion jobs |
| Privacy | Public links are opt-in, revocable, and document-scoped only |

---

## 10. Out of Scope (v1)

- Real-time multiplayer editing of documents.
- Non-document data sources (web crawlers, databases).
- On-prem / self-hosted deployment.
- Mobile native apps.

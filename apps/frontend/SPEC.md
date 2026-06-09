# Contexto — Frontend Specification

> Next.js 15 frontend for [Contexto](../SPEC.md). Multi-tenant document intelligence SaaS with RAG chat, team workspaces, Stripe billing, and shareable public document links.

---

## 1. Overview

| Field | Value |
| --- | --- |
| Product name | Contexto |
| Frontend role | Authenticated workspace UI, document management, chat, billing, and public share pages |
| Backend API | NestJS at `/api` (see [backend README](../backend/README.md)) |
| Keywords | RAG, multi-tenancy, billing |

### User-facing goals

- Sign up, log in, and switch between workspaces.
- Upload PDFs/docs and track ingestion status.
- Chat with documents and see cited answers.
- Invite teammates and manage roles.
- View usage, upgrade plans, and manage billing via Stripe.
- Generate and share public read-only document links.

---

## 2. Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Design | [Anthropic frontend-design skill](../../.cursor/skills/frontend-design/SKILL.md) |
| Data fetching | Server Components + client-side fetch for mutations |
| Forms | React Hook Form + Zod (planned) |
| Auth | JWT stored in httpOnly cookie or secure client storage (planned) |
| Payments | Stripe Checkout redirect + Customer Portal redirect |

### Planned additions (not yet installed)

- `@tanstack/react-query` — client cache and mutations
- `react-hook-form`, `zod` — form validation
- `lucide-react` — icons
- `shadcn/ui` — component primitives (styled per [DESIGN.md](./DESIGN.md))

---

## 2.1 Design System

All UI must follow [DESIGN.md](./DESIGN.md) and the [frontend-design skill](../../.cursor/skills/frontend-design/SKILL.md).

| Attribute | Direction |
| --- | --- |
| Tone | Editorial / refined knowledge archive |
| Display font | Newsreader (serif) |
| Body font | DM Sans |
| Palette | Ink background, paper text, bronze accents, sage success |
| Motion | Staggered page reveals, subtle hover transitions |

---

## 3. Route Map

All authenticated routes live under `(dashboard)` layout. Public routes have no auth.

| Route | Type | Description |
| --- | --- | --- |
| `/` | Public | Marketing landing page |
| `/login` | Public | Login form |
| `/register` | Public | Registration form |
| `/dashboard` | Protected | Redirect to active workspace |
| `/workspaces` | Protected | List and create workspaces |
| `/workspaces/[id]` | Protected | Workspace home — document list |
| `/workspaces/[id]/documents/[docId]` | Protected | Document detail + chat |
| `/workspaces/[id]/settings` | Protected | Workspace name, members |
| `/workspaces/[id]/settings/members` | Protected | Invite, role change, remove |
| `/workspaces/[id]/settings/billing` | Protected (owner) | Plan, usage, Stripe actions |
| `/public/[slug]` | Public | Anonymous document chat via share link |

---

## 4. Layout Structure

```
app/
├── layout.tsx                 # Root layout (fonts, providers)
├── page.tsx                   # Landing page
├── (auth)/
│   ├── layout.tsx             # Centered auth shell
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/
│   ├── layout.tsx             # Sidebar + workspace switcher + user menu
│   └── workspaces/
│       ├── page.tsx
│       └── [id]/
│           ├── page.tsx
│           ├── documents/[docId]/page.tsx
│           └── settings/
│               ├── page.tsx
│               ├── members/page.tsx
│               └── billing/page.tsx
└── public/
    └── [slug]/page.tsx        # Public share page (no dashboard chrome)
```

### Dashboard shell

- **Sidebar:** workspace switcher, nav links (Documents, Settings), current user menu.
- **Header:** page title, optional actions (Upload, New chat).
- **Main:** page content.

### Public share shell

- Minimal branding header with document title.
- Chat-only interface; no workspace navigation or auth UI.

---

## 5. Feature Specifications

### 5.1 Auth

**Pages:** `/login`, `/register`

| Action | UI | API |
| --- | --- | --- |
| Register | Name, email, password form | `POST /api/auth/register` |
| Login | Email, password form | `POST /api/auth/login` |
| Logout | User menu action | `POST /api/auth/logout` |
| Session | Load on app init / middleware | `GET /api/auth/me` |

**Behavior**

- Redirect unauthenticated users from protected routes to `/login`.
- Redirect authenticated users away from `/login` and `/register` to `/dashboard`.
- Store JWT access token; attach as `Authorization: Bearer` on API requests.
- Show validation errors inline on forms.

---

### 5.2 Workspaces

**Pages:** `/workspaces`, `/workspaces/[id]`, `/workspaces/[id]/settings`

| Action | UI | API |
| --- | --- | --- |
| List workspaces | Grid or list with create button | `GET /api/workspaces` |
| Create workspace | Modal or inline form (name) | `POST /api/workspaces` |
| View workspace | Document list, upload CTA | `GET /api/workspaces/:id` |
| Switch workspace | Sidebar dropdown | Client state + route change |

**Behavior**

- Persist last active workspace in localStorage.
- Creating a workspace auto-navigates to its home page.
- Empty state when no documents exist.

---

### 5.3 Documents

**Pages:** `/workspaces/[id]`, `/workspaces/[id]/documents/[docId]`

| Action | UI | API |
| --- | --- | --- |
| Upload | Drag-and-drop zone + file picker | `POST /api/workspaces/:id/documents` |
| List | Table/cards: title, status, date, size | `GET /api/workspaces/:id/documents` |
| View detail | Title, metadata, chat panel | `GET /api/documents/:id` |
| Delete | Confirm dialog | `DELETE /api/documents/:id` |
| Poll status | Badge + progress while processing | `GET /api/documents/:id/status` |

**Document status UI**

| Status | Display |
| --- | --- |
| `uploading` | Spinner, "Uploading…" |
| `processing` | Spinner, "Processing…" |
| `ready` | Green badge, chat enabled |
| `failed` | Red badge, retry/remove actions |

**Behavior**

- Disable chat until status is `ready`.
- Poll status every 3s while `uploading` or `processing`.
- Support PDF and common doc formats (match backend acceptance).
- Show file size and upload date on list items.

---

### 5.4 Chat / RAG

**Pages:** `/workspaces/[id]/documents/[docId]`, embedded in workspace-wide chat (future)

| Action | UI | API |
| --- | --- | --- |
| Start conversation | Auto-create on first message | `POST /api/conversations` |
| Send message | Text input + send button | `POST /api/conversations/:id/messages` |
| View history | Scrollable message thread | `GET /api/conversations/:id/messages` |

**Message UI**

- User messages: right-aligned bubble.
- Assistant messages: left-aligned with markdown rendering.
- Citations: expandable block below assistant message showing source excerpts, chunk index, and relevance score.
- Loading state: typing indicator while awaiting response.

**Behavior**

- Scroll to latest message on new reply.
- Preserve conversation in URL or session for the document.
- Handle quota exceeded errors with upgrade CTA.

---

### 5.5 Team & Members

**Pages:** `/workspaces/[id]/settings/members`

| Action | UI | API | Roles allowed |
| --- | --- | --- | --- |
| List members | Table: name, email, role | via workspace detail | owner, admin |
| Invite member | Email + role select | `POST /api/workspaces/:id/members` | owner, admin |
| Change role | Inline select | `PATCH /api/workspaces/:id/members/:userId` | owner, admin |
| Remove member | Confirm + delete | `DELETE /api/workspaces/:id/members/:userId` | owner, admin |

**Role-based UI visibility**

| UI element | owner | admin | member | viewer |
| --- | --- | --- | --- | --- |
| Upload documents | ✓ | ✓ | ✓ | ✗ |
| Delete documents | ✓ | ✓ | own only | ✗ |
| Manage members | ✓ | ✓ | ✗ | ✗ |
| Billing settings | ✓ | ✗ | ✗ | ✗ |
| Chat | ✓ | ✓ | ✓ | ✓ |
| Public link controls | ✓ | ✓ | ✓ | ✗ |

---

### 5.6 Public Links

**Pages:** document detail (share controls), `/public/[slug]`

| Action | UI | API |
| --- | --- | --- |
| Create link | Toggle + copy URL button | `POST /api/documents/:id/public-link` |
| Enable/disable | Switch | `PATCH /api/public-links/:id` |
| Set expiry | Date picker (optional) | `PATCH /api/public-links/:id` |
| Revoke | Delete button | `DELETE /api/public-links/:id` |
| Public view | Document title + chat | `GET /api/public/:slug` |
| Public chat | Same chat UI, no auth | `POST /api/public/:slug/messages` |

**Behavior**

- Copy link to clipboard with toast confirmation.
- Public page shows "Link expired" or "Link disabled" states.
- No sidebar or authenticated chrome on public pages.

---

### 5.7 Billing

**Pages:** `/workspaces/[id]/settings/billing` (owner only)

| Action | UI | API |
| --- | --- | --- |
| View current plan | Plan card with features | via org/workspace context |
| View usage | Usage chart + breakdown table | `GET /api/billing/usage` |
| Upgrade | Plan cards with CTA buttons | `POST /api/billing/checkout` → Stripe redirect |
| Manage subscription | "Manage billing" button | `POST /api/billing/portal` → Stripe redirect |

**Plans display**

| Plan | Documents/mo | Queries/mo | Price |
| --- | --- | --- | --- |
| Free | 5 | 50 | $0 |
| Pro | 100 | 1,000 | TBD |
| Team | 500 | 5,000 | TBD |

**Behavior**

- Show usage progress bars against plan quotas.
- Warn at 80% usage (soft limit banner).
- Block upload/chat at 100% with upgrade modal (hard limit).
- Return from Stripe Checkout to billing page with success/cancel query params.

---

## 6. Component Plan

Planned components under `components/`. Not implemented in v0 scaffold.

```
components/
├── ui/                        # shadcn primitives (Button, Input, Dialog, etc.)
├── layout/
│   ├── sidebar.tsx
│   ├── header.tsx
│   └── workspace-switcher.tsx
├── auth/
│   ├── login-form.tsx
│   └── register-form.tsx
├── documents/
│   ├── document-list.tsx
│   ├── document-card.tsx
│   ├── upload-zone.tsx
│   └── status-badge.tsx
├── chat/
│   ├── chat-panel.tsx
│   ├── message-list.tsx
│   ├── message-bubble.tsx
│   ├── citation-block.tsx
│   └── chat-input.tsx
├── members/
│   ├── member-table.tsx
│   └── invite-form.tsx
├── billing/
│   ├── plan-card.tsx
│   ├── usage-meter.tsx
│   └── upgrade-banner.tsx
└── public-links/
    ├── share-dialog.tsx
    └── copy-link-button.tsx
```

---

## 7. Data Layer

### API client (`lib/api/`)

```
lib/
├── api/
│   ├── client.ts              # fetch wrapper with auth header, base URL
│   ├── auth.ts
│   ├── workspaces.ts
│   ├── documents.ts
│   ├── conversations.ts
│   ├── public-links.ts
│   └── billing.ts
├── auth/
│   ├── session.ts             # token read/write
│   └── middleware.ts          # route protection helpers
└── hooks/                     # React Query hooks (planned)
    ├── use-workspaces.ts
    ├── use-documents.ts
    ├── use-chat.ts
    └── use-billing.ts
```

### API client behavior

- Base URL from `NEXT_PUBLIC_API_URL` (default `http://localhost:3001/api`).
- Attach JWT from session on every request.
- Normalize errors into `{ message, statusCode }` shape.
- Redirect to `/login` on 401.

---

## 8. State Management

| Concern | Approach |
| --- | --- |
| Server data | React Query for lists, detail, and mutations |
| Auth session | Context or cookie via middleware |
| Active workspace | React context + localStorage |
| Chat messages | React Query with optimistic updates for user messages |
| UI state | Local component state (modals, form inputs) |

---

## 9. Middleware & Auth Guard

`middleware.ts` at project root:

- Match `/dashboard`, `/workspaces/*` — require auth.
- Match `/login`, `/register` — redirect if already authenticated.
- `/public/*` — always public, no auth check.

---

## 10. Environment Variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_APP_URL` | Frontend origin (for Stripe return URLs) |

---

## 11. Non-Functional Requirements

| Area | Requirement |
| --- | --- |
| Performance | Use RSC for static shells; lazy-load chat panel |
| Accessibility | Keyboard-navigable chat, ARIA labels on forms |
| Responsive | Mobile-friendly public share page; desktop-first dashboard |
| Error handling | Toast notifications for API errors; inline form validation |
| Loading | Skeleton states for document list and chat history |
| SEO | Landing page metadata; noindex on dashboard routes |

---

## 12. Implementation Phases

| Phase | Scope |
| --- | --- |
| 1 | Auth pages, API client, middleware, dashboard shell |
| 2 | Workspace list/create, document upload and list |
| 3 | Chat UI with citations, status polling |
| 4 | Members settings, role-based UI |
| 5 | Public share page and link controls |
| 6 | Billing page, usage meters, Stripe redirects |

---

## 13. Out of Scope (v1)

- Real-time streaming responses (SSE/WebSocket).
- Document preview/viewer (PDF render inline).
- Dark mode toggle.
- Internationalization.
- Mobile native apps.
- Offline support.

See [SPEC.md](../../SPEC.md) for the full product specification.

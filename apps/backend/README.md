# Contexto Backend

NestJS API for [Contexto](../../SPEC.md) — a multi-tenant AI document intelligence platform with RAG chat, team workspaces, Stripe billing, and shareable public document links.

## Tech Stack

- **Framework:** NestJS 11, TypeScript
- **Database:** PostgreSQL via TypeORM
- **Vector store:** Pinecone
- **AI:** OpenRouter (chat + embeddings, OpenAI-compatible API)
- **Billing:** Stripe
- **Auth:** JWT (Passport)

## Prerequisites

- Node.js 20+
- PostgreSQL
- API keys for OpenRouter, Pinecone, and Stripe (when implementing integrations)

## Getting Started

```bash
npm install
cp .env.example .env
npm run start:dev
```

The API runs at `http://localhost:3001/api`.

## Environment Variables

| Variable | Description |
| --- | --- |
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default `3001`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `FRONTEND_URL` | Frontend origin (CORS + OpenRouter HTTP-Referer) |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `OPENROUTER_BASE_URL` | OpenRouter API base (default `https://openrouter.ai/api/v1`) |
| `OPENROUTER_CHAT_MODEL` | Chat model (e.g. `openai/gpt-4o-mini`, `anthropic/claude-3.5-sonnet`) |
| `OPENROUTER_EMBEDDING_MODEL` | Embedding model (e.g. `openai/text-embedding-3-small`) |
| `APP_NAME` | App name sent to OpenRouter (`X-Title` header) |
| `PINECONE_API_KEY` | Pinecone API key |
| `PINECONE_INDEX` | Pinecone index name |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

## Scripts

| Command | Description |
| --- | --- |
| `npm run start:dev` | Start in watch mode |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run compiled output |
| `npm run lint` | Lint and fix |
| `npm run test` | Unit tests |
| `npm run test:e2e` | End-to-end tests |

## Project Structure

```
src/
├── auth/              # Register, login, JWT strategy
├── users/             # User entity and service
├── organizations/     # Tenant org and plan
├── workspaces/        # Workspaces and memberships
├── documents/         # Upload, list, delete, status
├── rag/               # Ingestion pipeline and query service
├── conversations/     # Chat endpoints
├── public-links/      # Shareable document links
├── billing/           # Stripe checkout, portal, usage, webhooks
├── llm/               # OpenRouter client (chat + embeddings)
├── pinecone/          # Pinecone client (stub)
├── common/            # Guards, decorators, enums
└── database/          # TypeORM configuration
```

## API Endpoints

All routes are prefixed with `/api`.

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Workspaces
- `GET /workspaces`
- `POST /workspaces`
- `GET /workspaces/:id`
- `POST /workspaces/:id/members`
- `PATCH /workspaces/:id/members/:userId`
- `DELETE /workspaces/:id/members/:userId`

### Documents
- `POST /workspaces/:id/documents`
- `GET /workspaces/:id/documents`
- `GET /documents/:id`
- `DELETE /documents/:id`
- `GET /documents/:id/status`

### Chat
- `POST /conversations`
- `POST /conversations/:id/messages`
- `GET /conversations/:id/messages`

### Public Links
- `POST /documents/:id/public-link`
- `PATCH /public-links/:id`
- `DELETE /public-links/:id`
- `GET /public/:slug`
- `POST /public/:slug/messages`

### Billing
- `POST /billing/checkout`
- `POST /billing/portal`
- `GET /billing/usage`
- `POST /billing/webhook`

## Multi-Tenancy

- Organizations own workspaces; users join via memberships with roles (`owner`, `admin`, `member`, `viewer`).
- All workspace-scoped data is filtered by `workspace_id`.
- Pinecone vectors are namespaced per workspace.
- Public links expose read-only, document-scoped chat without authentication.

## Current Status

OpenRouter, Pinecone, and Stripe integrations use configured API keys. Document ingestion runs synchronously in-process; a background job queue is planned for production.

See [SPEC.md](../../SPEC.md) for the full product specification.

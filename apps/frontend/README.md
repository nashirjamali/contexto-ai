# Contexto Frontend

Next.js 15 frontend for [Contexto](../../SPEC.md). See [SPEC.md](./SPEC.md) for the full frontend specification.

## Tech Stack

- Next.js 15 (App Router)
- React 19, TypeScript
- Tailwind CSS 4
- Design: [Anthropic frontend-design skill](../../.cursor/skills/frontend-design/SKILL.md)

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Requires the [backend API](../backend/) running at `http://localhost:3001/api`.

## Environment Variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_APP_URL` | Frontend origin |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Lint |

## Status

All feature pages from [SPEC.md](./SPEC.md) are implemented. Run the backend API and PostgreSQL before testing authenticated flows.

```bash
# from repo root
npm run docker:up
npm run dev
```

FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/

RUN npm ci --workspace=backend --include-workspace-root

COPY apps/backend ./apps/backend

RUN npm run build -w backend

FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache postgresql-client

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/

RUN npm ci --workspace=backend --include-workspace-root --omit=dev

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

WORKDIR /app/apps/backend

RUN mkdir -p uploads

EXPOSE 3001

COPY apps/backend/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]

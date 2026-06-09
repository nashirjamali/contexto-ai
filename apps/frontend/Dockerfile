FROM node:20-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/

RUN npm ci --workspace=frontend --include-workspace-root

COPY apps/frontend ./apps/frontend

RUN npm run build -w frontend

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/

RUN npm ci --workspace=frontend --include-workspace-root --omit=dev

COPY --from=builder /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public

WORKDIR /app/apps/frontend

EXPOSE 3000

CMD ["npm", "start"]

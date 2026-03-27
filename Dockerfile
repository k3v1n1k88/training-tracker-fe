# ---- Builder ----
FROM node:20-alpine AS builder

ARG VITE_API_BASE_URL
ARG VITE_BASE_PATH

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN cp .env.${ENVIRONMENT} .env 2>/dev/null || true
RUN npm run build

# ---- Production ----
FROM node:20-alpine

ENV NODE_ENV=${ENVIRONMENT}
WORKDIR /app

RUN npm install -g serve

COPY --from=builder /build/dist ./dist

USER node
EXPOSE 3005

CMD ["serve", "-s", "dist", "-l", "3005"]

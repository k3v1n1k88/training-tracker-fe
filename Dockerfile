# ---- Builder ----
FROM node:20-alpine AS builder

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Asset holder ----
# Minimal image that holds built assets for nginx volume sharing
FROM alpine:3.20

COPY --from=builder /build/dist /app/dist

# Copy built assets to shared volume, then stay alive
CMD ["sh", "-c", "cp -r /app/dist/* /serve/ && echo 'Assets copied to /serve/' && tail -f /dev/null"]

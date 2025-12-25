# --- Stage 1: Build ---
FROM node:24.12.0-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json*  ./

RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# --- Stage 2: Run ---
FROM node:24.12.0-alpine

WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /app/dist ./dist

USER app

EXPOSE 3000

CMD ["node", "dist/index.js"]
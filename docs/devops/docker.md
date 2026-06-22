---
title: Docker
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Docker

Containerization in one sentence: package the app *with* its dependencies so it runs identically on your laptop, CI, staging, and production.

## A production-quality Dockerfile

<Tabs groupId="lang">
  <TabItem value="node" label="Node.js" default>

```dockerfile
# 1. Build stage — has dev deps + compiler
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2. Runtime stage — minimal, no dev deps
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist

# Run as non-root
RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://localhost:3000/health || exit 1
CMD ["node", "dist/server.js"]
```

  </TabItem>
  <TabItem value="python" label="Python">

```dockerfile
FROM python:3.12-slim AS builder
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:3.12-slim AS runtime
WORKDIR /app
ENV PATH=/root/.local/bin:$PATH PYTHONUNBUFFERED=1
COPY --from=builder /root/.local /root/.local
COPY . .

RUN useradd -m -u 1000 app && chown -R app:app /app
USER app

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s CMD python -c "import urllib.request;urllib.request.urlopen('http://localhost:8000/health')" || exit 1
CMD ["gunicorn", "-b", "0.0.0.0:8000", "app.main:app"]
```

  </TabItem>
</Tabs>

## The principles

| Principle | Why |
|---|---|
| **Small base image** — `alpine`, `distroless`, `slim` | Smaller attack surface, faster pulls |
| **Multi-stage build** | Don't ship the compiler to production |
| **Don't run as root** | Container escapes become host compromises |
| **`.dockerignore`** — exclude `node_modules`, `.git`, `.env` | Smaller context, faster builds, no leaked secrets |
| **Pin base image tag** — `node:22-alpine`, not `node:latest` | Reproducible builds |
| **One process per container** | Easier to scale, observe, restart |
| **Healthcheck** | Orchestrator knows when to restart |
| **Layer ordering** — least-changing first | Cache hits on rebuilds |

## .dockerignore essentials

```
node_modules
.git
.gitignore
.env
.env.*
*.log
coverage/
dist/
.DS_Store
.idea/
.vscode/
README.md
```

## Build the cache, not against it

Layer ordering for max cache reuse:

```dockerfile
# ✅ deps change rarely — copy lockfile FIRST
COPY package.json package-lock.json ./
RUN npm ci

# ✅ source changes often — copy LAST
COPY . .
RUN npm run build
```

Reverse this order and every code change re-downloads all deps.

## Anti-patterns

:::danger
- `FROM ubuntu:latest` — neither minimal nor pinned
- `RUN apt-get install -y curl` without `apt-get clean` — bloated image
- `ENV SECRET_KEY=hunter2` — baked secrets in the image
- `USER root` — running as root in prod
- Volume-mounting `/var/run/docker.sock` into a container — root on host
:::

## Local vs. production parity

The point of containers is *parity*. Treat them seriously:

- Same base image locally and in prod
- Same entrypoint, same env-var names
- Differences only in: replica count, resource limits, log destination, secret source

If `docker compose up` works locally but production breaks — your images aren't actually equivalent.

---
title: Local Setup
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Local Setup

**Goal:** Anyone — including a brand-new hire on day 1 — should be able to clone a repo and have it running locally in **under 30 minutes**. If it takes longer, the setup is broken.

## The baseline expectation

A new engineer should be able to:

```bash
git clone <repo>
cd <repo>
make up       # or ./bin/dev, or docker compose up — one command
```

…and have a working app at `http://localhost:<port>` within minutes.

## What a good `README.md` includes

1. **What this service is** — one sentence
2. **Prerequisites** — exact versions (Node 22, Python 3.12, Docker)
3. **Setup** — copy-paste commands
4. **Run** — single command
5. **Test** — single command
6. **Troubleshooting** — common errors and fixes
7. **Who owns it** — Slack channel or GitHub team

## Containerize the dependencies

Real DBs, queues, caches — never expect engineers to install Postgres locally.

<Tabs groupId="stack">
  <TabItem value="docker" label="docker-compose" default>

```yaml
# docker-compose.dev.yml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: app_dev
    ports: ["5432:5432"]
    volumes:
      - pgdata:/var/lib/postgresql/data
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
volumes:
  pgdata:
```

  </TabItem>
  <TabItem value="makefile" label="Makefile glue">

```makefile
.PHONY: up down logs test seed

up:
	docker compose -f docker-compose.dev.yml up -d
	@echo "→ app: http://localhost:3000"

down:
	docker compose -f docker-compose.dev.yml down

logs:
	docker compose -f docker-compose.dev.yml logs -f

test:
	npm run test

seed:
	npm run db:migrate && npm run db:seed
```

  </TabItem>
</Tabs>

## Env files

- `.env.example` — committed, no secrets, every required var listed with a sane default
- `.env` — gitignored, the actual local config
- Bootstrap step: `cp .env.example .env`

:::danger Never commit real secrets
Use a vault (1Password, AWS Secrets Manager, HashiCorp Vault) for anything production-adjacent. `.env.example` should contain only placeholder values like `<your-token-here>`.
:::

## The 30-minute test

Once a quarter, ask a teammate from a different team to set up your repo from scratch. Time it. Fix the friction points. This is the only honest measure of setup quality.

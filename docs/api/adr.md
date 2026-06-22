---
title: Architecture Decision Records (ADRs)
sidebar_position: 5
---

# Architecture Decision Records

An ADR is a short, dated document that captures *why* a significant architectural decision was made. It lives in git, next to the code, so it survives Confluence migrations and team turnover.

## When to write one

Write an ADR for any decision that:

- Is hard to reverse later
- Will be questioned by future engineers ("why did we choose X?")
- Has multiple reasonable alternatives
- Involves a non-trivial trade-off

Examples: choosing a queue technology, picking a frontend framework, defining auth strategy, splitting a monolith, picking a multi-tenant model.

**Don't** write one for: dependency bumps, refactoring, style preferences.

## Storage

```
docs/adr/
  0001-record-architecture-decisions.md
  0002-use-postgres-for-primary-storage.md
  0003-adopt-sqs-not-kafka-for-events.md
  ...
```

Files are append-only and never deleted. To revoke a decision, write a new ADR that supersedes the old one.

## Template

```markdown
# ADR-NNNN: <Short title — decision phrased as a fact>

- Status: Proposed | Accepted | Superseded by ADR-XXXX
- Date: YYYY-MM-DD
- Deciders: @alice, @bob

## Context

What's the problem? What constraints do we have? What forces are at play?
Keep this section honest — what you didn't know matters as much as what you did.

## Decision

The decision, stated as a fact. "We will use X."

## Alternatives Considered

What else did we look at? Why didn't we pick those? Be specific — "didn't fit"
is not useful; "30% slower at our expected write volume" is.

## Consequences

What does this enable? What does it cost? What new problems does it create?
This section is what future engineers care about most.

## References

Links to benchmarks, prior art, prototypes, related ADRs.
```

## A worked example

```markdown
# ADR-0003: Adopt SQS, not Kafka, for asynchronous events

- Status: Accepted
- Date: 2026-03-12
- Deciders: @sushant, @kajal

## Context

Three services need to communicate via events: order-service publishes
"order.paid"; inventory-service and email-service consume it.
Expected volume: 50 events/sec average, 500/sec peak.
Team size: 4 engineers. No dedicated platform team.

## Decision

We will use AWS SQS (standard queue + SNS fan-out) for inter-service events.

## Alternatives Considered

- **Kafka (managed via MSK)**: higher throughput ceiling, better for replay,
  but requires partitioning expertise and at our volume gives no measurable
  win. Operational burden is real even on MSK.
- **Redis Streams**: cheap, fast, but persistence story is weaker; we'd be
  one Redis crash away from event loss.
- **RabbitMQ**: solid, but no managed offering in our AWS region without
  CloudAMQP, which is one more vendor.

## Consequences

+ Pay-per-use, no cluster to babysit.
+ SNS+SQS gives us multi-subscriber fanout.
- 256KB message size limit. We'll store large payloads in S3 and pass S3 keys.
- At-least-once delivery — consumers must be idempotent.
- No native replay — if we need it later, we add S3 archival + reprocessor.

We'll revisit if peak volume exceeds 5000/sec sustained, or if we need
ordered processing across all events (today we only need per-order ordering,
which we get via FIFO queues for that subset).

## References

- Benchmark: docs/benchmarks/queue-bake-off-2026-03.md
- Related: ADR-0002 (we standardized on AWS)
```

## ADR review process

1. Author drafts as a PR
2. Add deciders as reviewers
3. Discussion happens in the PR
4. Merge when accepted — at which point it's "Accepted" forever
5. If superseded later, the new ADR references the old one's number

Once merged, an ADR is **not edited** to change the decision. To change, write a new one.

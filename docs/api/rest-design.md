---
title: REST API Design
sidebar_position: 2
---

# REST API Design

REST has been a default since 2000 for good reason: it leans on HTTP semantics that every client, proxy, and CDN already understands. Here's how to do it well.

## Resource modeling

URLs name **resources** (nouns), not actions (verbs).

| ✅ Good | ❌ Bad |
|---|---|
| `GET /orders/123` | `GET /getOrder?id=123` |
| `POST /orders` | `POST /createOrder` |
| `DELETE /orders/123` | `POST /deleteOrder?id=123` |
| `GET /users/42/orders` | `GET /getUserOrders?userId=42` |

## HTTP methods — the contract

| Method | Semantics | Idempotent? | Safe? |
|---|---|---|---|
| `GET` | Read | ✅ | ✅ |
| `POST` | Create new resource | ❌ | ❌ |
| `PUT` | Replace resource | ✅ | ❌ |
| `PATCH` | Partial update | should be | ❌ |
| `DELETE` | Remove resource | ✅ | ❌ |

**Idempotent** = same request multiple times = same result. Critical for retry safety.

## Status codes (the ones you actually need)

| Code | When |
|---|---|
| `200 OK` | Successful GET, PUT, PATCH |
| `201 Created` | Successful POST that created a resource (include `Location` header) |
| `202 Accepted` | Async operation queued |
| `204 No Content` | Successful DELETE or PUT with no body |
| `400 Bad Request` | Client sent malformed data |
| `401 Unauthorized` | Auth missing or invalid |
| `403 Forbidden` | Authenticated but not allowed |
| `404 Not Found` | Resource doesn't exist |
| `409 Conflict` | Concurrent update, business rule conflict |
| `422 Unprocessable Entity` | Validation failed |
| `429 Too Many Requests` | Rate limit hit (include `Retry-After`) |
| `500 Internal Server Error` | Bug — should be rare and alerted |
| `502 / 503 / 504` | Upstream / dependency problems |

:::warning Don't return 200 for errors
Returning `200 OK` with `{"error": "user not found"}` breaks every caching proxy, retry library, and monitoring tool downstream. Use real status codes.
:::

## Error response shape

Pick a shape, use it everywhere. RFC 7807 is a reasonable default:

```json
{
  "type": "https://api.example.com/errors/insufficient-funds",
  "title": "Insufficient funds",
  "status": 422,
  "detail": "Account balance is 1500, requested 2000",
  "instance": "/transfers/abc123",
  "request_id": "req_xyz"
}
```

Always include `request_id` so users can quote it to support and you can find the log.

## Pagination

Two viable strategies:

### Cursor-based (preferred for large / changing datasets)

```
GET /orders?cursor=eyJpZCI6MTAwfQ&limit=50

200 OK
{
  "data": [...],
  "next_cursor": "eyJpZCI6MTUwfQ",
  "has_more": true
}
```

### Offset-based (fine for small static lists)

```
GET /orders?page=2&page_size=50
```

Avoid offset for tables over ~10k rows — `OFFSET 50000` is slow.

## Versioning

Three approaches; pick one:

| Approach | Example | Note |
|---|---|---|
| URL | `/v1/orders` | Easiest to operate, breaks REST purism |
| Header | `Accept: application/vnd.example.v1+json` | Clean URLs, harder to debug |
| Query param | `/orders?v=1` | Don't — caching nightmare |

URL versioning is the pragmatic default. Bump the major version only on **breaking changes**.

## Backward compatibility rules

You may, in a `v1`:

- ✅ Add new optional fields to responses
- ✅ Add new endpoints
- ✅ Add new optional query/body params
- ✅ Accept more lenient input

You may NOT, in a `v1`:

- ❌ Remove or rename fields
- ❌ Change a field's type
- ❌ Make an optional field required
- ❌ Change the meaning of existing values

Breaking changes go in `v2`. Keep `v1` alive until usage drops to zero (announce deprecation 6–12 months ahead).

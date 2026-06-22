---
title: GraphQL
sidebar_position: 3
---

# GraphQL

A query language for your API: clients ask for exactly the fields they need; the server returns exactly that shape.

## When to use GraphQL

| Use GraphQL when | Stick with REST when |
|---|---|
| Multiple clients with different data needs (mobile, web, partners) | One client, simple resource model |
| Aggregating data from many backend services | Resources map cleanly to entities |
| Strongly typed schema is a hard requirement | Existing REST works fine, GraphQL is just shiny |
| Over-fetching / under-fetching is a real pain point | You'd be adding GraphQL "because everyone else does" |

:::info GraphQL is not REST's replacement
It's a different tool for a different problem. Many teams successfully ship REST APIs for a decade. Don't migrate just to migrate.
:::

## Schema first

Design the schema before the code:

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  orders(first: Int = 10, after: String): OrderConnection!
}

type Order {
  id: ID!
  total: Money!
  status: OrderStatus!
  items: [OrderItem!]!
  createdAt: DateTime!
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  CANCELLED
}

type Query {
  user(id: ID!): User
  orders(filter: OrderFilter): OrderConnection!
}

type Mutation {
  createOrder(input: CreateOrderInput!): CreateOrderPayload!
}
```

## Common pitfalls

### 1. The N+1 problem

```graphql
query {
  users(first: 100) {
    edges {
      node {
        name
        orders {              # ← naive resolver = 100 separate DB queries
          total
        }
      }
    }
  }
}
```

**Fix:** use a DataLoader pattern — batch and cache resolver calls within a single request.

### 2. No query depth/complexity limits

A malicious or naive client can ask for `user.friends.friends.friends...` and bring the server down. Enforce:

- Max query depth (e.g., 7)
- Max query complexity score
- Per-field cost budgets

### 3. Mutations without input types

```graphql
# ❌ many positional args, no evolution path
type Mutation {
  updateUser(id: ID!, name: String, email: String, age: Int): User!
}

# ✅ single input type, can add fields without breaking clients
type Mutation {
  updateUser(input: UpdateUserInput!): UpdateUserPayload!
}
```

### 4. Treating GraphQL as just a JSON RPC

Use the type system. Make illegal states unrepresentable. Prefer unions, enums, and non-null markers over `String + comment`.

## Authorization

Authorization in GraphQL is **per-field**, not per-endpoint:

```typescript
const resolvers = {
  User: {
    email: (user, _, ctx) => {
      if (ctx.viewer.id !== user.id && !ctx.viewer.isAdmin) {
        return null;  // or throw a ForbiddenError
      }
      return user.email;
    }
  }
};
```

Don't bolt this on later — design auth into the schema from day 1.

## Observability gotchas

- A single HTTP `POST /graphql` can hide 50 different operations — tag your logs/metrics by operation name
- Errors come back in 200 OK responses by default — instrument the `errors[]` array, not just the HTTP status
- Use APM tools (Apollo Studio, Datadog) that understand GraphQL natively

---
title: "4. Readability First"
sidebar_position: 5
---

# 4. Readability First

**Rule:** Code is read **10× more** than it is written. Optimize for the reader, not the writer.

## Why this matters

Cleverness has a half-life. The "elegant" one-liner you wrote at 11pm becomes the bug nobody can debug at 3am six months later.

:::warning Real cost
A confusing function costs every future developer 5–30 minutes of context-loading. Over a year, that's hours per function across the team.
:::

## The readability hierarchy

In order of impact:

1. **Naming** — `customerById` beats `cust`, `getCustomerById`, or `c`
2. **Function length** — if a function is longer than your screen, it's too long
3. **Nesting depth** — more than 3 levels means you need to extract
4. **Side effects** — pure functions are easier to read than mutating ones
5. **Comments** — only when the code can't speak for itself

## Before vs. after

**Before:**

```python
def p(d, u):
    r = []
    for x in d:
        if x['s'] == 1 and x['u'] == u:
            r.append({'i': x['i'], 'n': x['n']})
    return r
```

**After:**

```python
def active_items_for_user(items, user_id):
    return [
        {'id': item['id'], 'name': item['name']}
        for item in items
        if item['status'] == ACTIVE and item['owner_id'] == user_id
    ]
```

Same logic. The second version explains itself.

## The "new teammate" test

Ask: *would a new teammate, reading this file for the first time on day 2, understand the intent?* If not, rename, refactor, or add a 1-line *why*-comment.

:::tip
Re-read your own diff before requesting review. If you have to think for more than 5 seconds about your own code, the reviewer will too.
:::

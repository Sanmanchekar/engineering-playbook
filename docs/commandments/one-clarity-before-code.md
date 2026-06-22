---
title: "1. Clarity Before Code"
sidebar_position: 2
---

# 1. Clarity Before Code

**Rule:** Before you open the editor, you must be able to articulate — in one paragraph — *what* you're building, *who* it's for, and *what success looks like*.

## Why this matters

Most failed engineering projects don't fail at the keyboard. They fail at the spec. A misunderstood requirement is the most expensive bug in the world because no test will catch it.

:::warning Common smell
"Let me just start coding and we'll figure it out." — this is fine for a 30-minute exploration spike. It is fatal for a 2-week feature.
:::

## What "clarity" looks like

A one-paragraph brief that answers:

1. **Problem** — what does the user struggle with today?
2. **Audience** — who specifically?
3. **Success** — what observable metric or behavior changes?
4. **Out of scope** — what we are *not* doing (this is often more useful than the in-scope list).

## Example

> **Problem:** New QA hires take 3+ weeks to ramp up on our test framework because conventions are scattered across Slack.
> **Audience:** QA engineers, weeks 1–4.
> **Success:** A new QA can submit their first PR to the test repo on day 7.
> **Out of scope:** Rewriting the framework itself.

## The 5-minute clarity check

Before you commit to a task, answer these out loud (or in writing). If you stumble on any of them, go back to the requester.

- What problem does this solve?
- Who is the user?
- How will I know it worked?
- What is the smallest version I could ship?
- What could go wrong?

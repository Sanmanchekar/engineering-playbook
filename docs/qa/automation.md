---
title: Test Automation
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Test Automation

Automation is leverage — but bad automation is *negative* leverage. Brittle tests that fail randomly destroy team trust and get muted.

## Pick the right tool

| Tool | Best for | Strengths | Watch out |
|---|---|---|---|
| **Playwright** | Modern web E2E | Fast, reliable, multi-browser, great DX | Younger ecosystem |
| **Cypress** | Web E2E | Great UI for debugging, time-travel | Same-origin only without workarounds |
| **Selenium** | Legacy / non-web browsers | Universal, mature | Slow, verbose, brittle |
| **Postman/Newman** | API contracts | Visual, easy for non-devs | Limited logic; outgrown fast |
| **k6 / Locust** | Load + perf | Code-first, CI-friendly | Not for functional testing |

## Anatomy of a good E2E test

<Tabs groupId="framework">
  <TabItem value="playwright" label="Playwright" default>

```typescript
import {test, expect} from '@playwright/test';

test('user can complete checkout with a valid card', async ({page}) => {
  // Arrange: fresh user, known cart state
  await page.goto('/cart');
  await expect(page.getByRole('heading', {name: 'Your cart'})).toBeVisible();

  // Act
  await page.getByRole('button', {name: 'Proceed to checkout'}).click();
  await page.getByLabel('Card number').fill('4242424242424242');
  await page.getByLabel('Expiry').fill('12/30');
  await page.getByLabel('CVV').fill('123');
  await page.getByRole('button', {name: 'Pay'}).click();

  // Assert on user-visible outcome
  await expect(page.getByText('Order confirmed')).toBeVisible({timeout: 10_000});
});
```

  </TabItem>
  <TabItem value="cypress" label="Cypress">

```javascript
describe('Checkout', () => {
  beforeEach(() => {
    cy.task('db:seed', 'cart-with-one-item');
    cy.visit('/cart');
  });

  it('completes with valid card', () => {
    cy.contains('button', 'Proceed to checkout').click();
    cy.get('[data-test=card-number]').type('4242424242424242');
    cy.get('[data-test=expiry]').type('12/30');
    cy.get('[data-test=cvv]').type('123');
    cy.contains('button', 'Pay').click();
    cy.contains('Order confirmed', {timeout: 10_000}).should('be.visible');
  });
});
```

  </TabItem>
</Tabs>

## Patterns that pay off

### 1. Locate by role, not by class

```javascript
// ❌ brittle — class names change
await page.click('.btn-primary-large');

// ✅ semantic — survives redesigns
await page.getByRole('button', {name: 'Submit order'}).click();
```

### 2. Wait for state, not time

```javascript
// ❌ flaky and slow
await sleep(3000);

// ✅ wait for what you actually need
await expect(page.getByText('Order confirmed')).toBeVisible();
```

### 3. Fresh state per test

Each test should set up its own data. **Shared state between tests is the #1 cause of flakiness.** Use DB seeding hooks, API setup calls, or factories — not "test 1 creates the user, test 2 uses it."

### 4. Test IDs as a contract

Add `data-testid` attributes for elements that QA depends on:

```html
<button data-testid="confirm-purchase">Confirm</button>
```

This decouples tests from CSS/text changes.

## Anti-patterns

:::danger Avoid
- **Sleep-based waits** — `time.sleep(5)` is a confession that your locator is wrong
- **One giant test** that does login + browse + checkout + refund — split into 4
- **Tests that depend on test order** — randomize order to surface this
- **Tests that hit real third parties** — use mocks/stubs; nothing kills CI faster than a flaky upstream
- **Hardcoded data** that ages out — use factories or relative dates
:::

## Flakiness budget

Track your flake rate: `(reruns to green) / (total runs)`.

| Rate | Verdict |
|---|---|
| < 1% | Healthy |
| 1–5% | Needs attention |
| > 5% | Quarantine and fix; the suite is losing trust |

When a test flakes, **quarantine immediately** (skip with a ticket), don't let it pollute CI.

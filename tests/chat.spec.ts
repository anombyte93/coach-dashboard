import { test, expect } from '@playwright/test';

// Use relative URL to work with playwright baseURL
const DASHBOARD_URL = '/v2/index.html';

test.describe('AI Coaching Chatbot', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'coachDashboardSession',
        JSON.stringify({
          user: 'playwright',
          role: 'coach',
          expiry: Date.now() + 60 * 60 * 1000,
        }),
      );
    });

    await page.route('**/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body: 'data: {"text":"Mock response from coach"}\n\ndata: [DONE]\n\n',
      });
    });

    await page.goto(DASHBOARD_URL);
  });

  test('Chat toggle button is visible on page load', async ({ page }) => {
    const toggle = page.locator('.chat-toggle');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveText(/Ask Coach/i);
  });

  test('Click toggle opens chat container', async ({ page }) => {
    const container = page.locator('.chat-container');
    await page.locator('.chat-toggle').click();
    await expect(container).toBeVisible();
  });

  test('Click close button hides chat container', async ({ page }) => {
    const container = page.locator('.chat-container');
    await page.locator('.chat-toggle').click();
    await expect(container).toBeVisible();

    await page.locator('.chat-close').click();
    await expect(container).toBeHidden();
  });

  test('Chat shows initial disclaimer message', async ({ page }) => {
    await page.locator('.chat-toggle').click();
    const firstAssistantMessage = page.locator('.chat-message.assistant').first();
    await expect(firstAssistantMessage).toContainText('AI coaching assistant');
  });

  test('Input field is focused when chat opens', async ({ page }) => {
    const input = page.locator('.chat-form input[name="message"]');
    await page.locator('.chat-toggle').click();
    await expect(input).toBeFocused();
  });

  test('Typing in input and submitting shows user message', async ({ page }) => {
    await page.locator('.chat-toggle').click();

    const input = page.locator('.chat-form input[name="message"]');
    const messageText = 'Hello Coach';
    await input.fill(messageText);
    await page.locator('.chat-form button[type="submit"]').click();

    await expect(page.locator('.chat-message.user').last()).toHaveText(messageText);
  });

  test('User message appears in message list with correct styling', async ({ page }) => {
    await page.locator('.chat-toggle').click();

    const input = page.locator('.chat-form input[name="message"]');
    const messageText = 'Style check message';
    await input.fill(messageText);
    await page.locator('.chat-form button[type="submit"]').click();

    const userMessage = page.locator('.chat-message.user').last();
    await expect(userMessage).toHaveText(messageText);

    const bgColor = await userMessage.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bgColor).toBe('rgb(59, 130, 246)');
  });

  test('Submit button is disabled during streaming (mock timeout)', async ({ page }) => {
    await page.unroute('**/api/chat');
    await page.route('**/api/chat', async (route) => {
      await page.waitForTimeout(500);
      await route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body: 'data: {"text":"Streaming..."}\n\ndata: [DONE]\n\n',
      });
    });

    await page.locator('.chat-toggle').click();
    const input = page.locator('.chat-form input[name="message"]');
    const submit = page.locator('.chat-form button[type="submit"]');

    await input.fill('Hold while streaming');
    await submit.click();

    await expect(submit).toBeDisabled();
    await page.waitForTimeout(600);
    await expect(submit).toBeEnabled();
  });

  test('Chat is hidden in print media query', async ({ page }) => {
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.chat-widget')).toBeHidden();
    await page.emulateMedia({ media: 'screen' });
  });

  test('Multiple open/close toggles work correctly', async ({ page }) => {
    const toggle = page.locator('.chat-toggle');
    const container = page.locator('.chat-container');
    const close = page.locator('.chat-close');

    await toggle.click();
    await expect(container).toBeVisible();

    await toggle.click();
    await expect(container).toBeHidden();

    await toggle.click();
    await expect(container).toBeVisible();

    await close.click();
    await expect(container).toBeHidden();

    await toggle.click();
    await expect(container).toBeVisible();
  });
});

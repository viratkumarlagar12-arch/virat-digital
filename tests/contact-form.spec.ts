import { test, expect, type Page } from '@playwright/test';

// Netlify Forms receives a urlencoded POST to "/". Tests stand in for it.
async function stubSubmit(page: Page, status: number) {
  const bodies: string[] = [];
  await page.route('**/*', async (route) => {
    const request = route.request();
    if (request.method() === 'POST' && new URL(request.url()).pathname === '/') {
      bodies.push(request.postData() ?? '');
      await route.fulfill({ status, body: '' });
    } else {
      await route.continue();
    }
  });
  return bodies;
}

const form = (page: Page) => page.locator('form[name="contact"]');

test('is set up for Netlify Forms with a hidden honeypot', async ({ page }) => {
  await page.goto('/contact/');
  await expect(form(page)).toHaveAttribute('method', 'POST');
  await expect(form(page)).toHaveAttribute('data-netlify', 'true');
  await expect(form(page)).toHaveAttribute('data-netlify-honeypot', 'bot-field');
  await expect(form(page).locator('input[name="form-name"]')).toHaveValue('contact');
  await expect(form(page).locator('input[name="bot-field"]')).toBeHidden();
});

test('empty submit explains each missing field and focuses the first', async ({ page }) => {
  await page.goto('/contact/');
  await form(page).getByRole('button', { name: 'Send project details' }).click();
  await expect(form(page).getByText('Please enter your name.')).toBeVisible();
  await expect(form(page).getByText('Please enter your email address.')).toBeVisible();
  await expect(form(page).getByText(/Tell me a little more/)).toBeVisible();
  await expect(page.getByLabel('Name')).toBeFocused();
  await expect(page.getByLabel('Name')).toHaveAttribute('aria-invalid', 'true');
});

test('rejects a malformed email', async ({ page }) => {
  await page.goto('/contact/');
  await page.getByLabel('Name').fill('Asha');
  await page.getByLabel('Email').fill('asha@example');
  await page.getByLabel('Project details').fill('I need a logo for my bakery.');
  await form(page).getByRole('button', { name: 'Send project details' }).click();
  await expect(form(page).getByText('That email address looks incomplete.')).toBeVisible();
});

test('a WhatsApp number that is too short is called out as such', async ({ page }) => {
  await page.goto('/contact/');
  await page.getByLabel('Name').fill('Asha');
  await page.getByLabel('Email').fill('asha@example.com');
  await page.getByLabel('WhatsApp').fill('98765');
  await page.getByLabel('Project details').fill('I need a logo for my bakery.');
  await form(page).getByRole('button', { name: 'Send project details' }).click();
  await expect(form(page).getByText('That WhatsApp number looks too short.')).toBeVisible();
  await expect(page.getByLabel('WhatsApp')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Email')).not.toHaveAttribute('aria-invalid', 'true');
});

test('email is required, even when a WhatsApp number is given', async ({ page }) => {
  const bodies = await stubSubmit(page, 200);
  await page.goto('/contact/');
  await expect(page.getByLabel('Email')).toHaveAttribute('required', '');
  await expect(page.getByLabel('WhatsApp')).not.toHaveAttribute('required', /.*/);
  await expect(form(page).locator('#cf-reply-help')).toHaveText('Email is required. WhatsApp is optional.');
  await page.getByLabel('Name').fill('Asha');
  await page.getByLabel('WhatsApp').fill('+91 98765 43210');
  await page.getByLabel('Project details').fill('I need a logo for my bakery.');
  await form(page).getByRole('button', { name: 'Send project details' }).click();
  await expect(form(page).getByText('Please enter your email address.')).toBeVisible();
  await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Email')).toBeFocused();
  expect(bodies).toHaveLength(0);
});

test('a complete form posts to Netlify and says it was sent', async ({ page }) => {
  const bodies = await stubSubmit(page, 200);
  await page.goto('/contact/');
  await page.getByLabel('Name').fill('Asha');
  await page.getByLabel('Email').fill('asha@example.com');
  await page.getByLabel('Project details').fill('I need a logo for my bakery.');
  await form(page).getByRole('button', { name: 'Send project details' }).click();
  await expect(page.getByRole('status')).toContainText('Project details sent');
  expect(bodies).toHaveLength(1);
  const sent = new URLSearchParams(bodies[0]);
  expect(sent.get('form-name')).toBe('contact');
  expect(sent.get('bot-field')).toBe('');
  expect(sent.get('name')).toBe('Asha');
  expect(sent.get('email')).toBe('asha@example.com');
  expect(sent.get('message')).toBe('I need a logo for my bakery.');
  await expect(page.getByLabel('Name')).toHaveValue('');
});

test('a failed send keeps the details and offers WhatsApp instead', async ({ page }) => {
  await stubSubmit(page, 500);
  await page.goto('/contact/');
  await page.getByLabel('Name').fill('Asha');
  await page.getByLabel('Email').fill('asha@example.com');
  await page.getByLabel('Project details').fill('I need a logo for my bakery.');
  await form(page).getByRole('button', { name: 'Send project details' }).click();
  const status = page.getByRole('status');
  await expect(status).toContainText(/didn.t send/);
  await expect(status.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute('href', /wa\.me\/918210618353\?text=.*bakery/);
  await expect(page.getByLabel('Name')).toHaveValue('Asha');
});

test('a service in the URL is preselected', async ({ page }) => {
  await page.goto('/contact/?service=websites');
  await expect(page.getByLabel('Service', { exact: true })).toHaveValue('websites');
});

test('the script takes over validation when JavaScript runs', async ({ page }) => {
  await page.goto('/contact/');
  await expect(form(page)).toHaveAttribute('novalidate', '');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the browser blocks an empty form and the form still posts to /thanks/', async ({ page }) => {
    await page.goto('/contact/');
    await expect(form(page)).not.toHaveAttribute('novalidate', /.*/);
    await expect(form(page)).toHaveAttribute('action', '/thanks/');
    await form(page).getByRole('button', { name: 'Send project details' }).click();
    await expect(page).toHaveURL(/\/contact\/$/);
    for (const id of ['cf-name', 'cf-email', 'cf-message']) await expect(page.locator(`#${id}:invalid`)).toHaveCount(1);
    await expect(page.locator('#cf-whatsapp:invalid')).toHaveCount(0);
  });
});

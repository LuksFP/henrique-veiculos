import type { Page } from "@playwright/test";

export const ADMIN = {
  email: "admin.teste@henriqueveiculos.local",
  password: "HVTest@2026!",
};

export async function login(page: Page) {
  await page.goto("/login");
  await page.fill('[name="email"]', ADMIN.email);
  await page.fill('[name="password"]', ADMIN.password);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/admin**");
}

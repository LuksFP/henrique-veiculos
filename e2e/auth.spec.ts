import { test, expect } from "@playwright/test";
import { login, ADMIN } from "./helpers/auth";

test("login válido redireciona para /admin", async ({ page }) => {
  await login(page);
  await expect(page).toHaveURL(/\/admin/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});

test("senha errada exibe erro invalid", async ({ page }) => {
  await page.goto("/login");
  await page.fill('[name="email"]', ADMIN.email);
  await page.fill('[name="password"]', "senha-errada-999");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/error=invalid/);
  await expect(page.getByText("E-mail ou senha inválidos")).toBeVisible();
});

test("logout redireciona para /login", async ({ page }) => {
  await login(page);
  await page.click('button[type="submit"]:has-text("Sair")');
  await page.waitForURL(/\/login/);
  await expect(page).toHaveURL(/\/login/);
});

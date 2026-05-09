import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { login } from "./helpers/auth";

const EXPENSE = {
  description: "E2E Despesa Teste",
  amount: "1500",
};

async function createExpense(page: Page) {
  await page.goto("/admin/financeiro");
  const form = page.locator("details.adm-form-card");
  await form.locator("summary").click();
  await form.locator('[name="description"]').fill(EXPENSE.description);
  await form.locator('[name="amount"]').fill(EXPENSE.amount);
  await page.getByRole("button", { name: "Registrar Despesa" }).click();
  await page.waitForURL(/success=expense_created/);
}

async function deleteExpense(page: Page) {
  const row = page.locator(".fin-table-row").filter({ hasText: EXPENSE.description });
  await row.locator(".adm-btn-danger").click();
  await page.waitForURL(/success=expense_deleted/);
}

test.describe("Financeiro — Despesas", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("criar despesa aparece na tabela", async ({ page }) => {
    await createExpense(page);
    await expect(page.locator(".fin-table-row").filter({ hasText: EXPENSE.description })).toBeVisible();
    await expect(page.locator(".adm-alert--ok")).toContainText("Despesa cadastrada");
    await deleteExpense(page);
  });

  test("excluir despesa remove da tabela", async ({ page }) => {
    await createExpense(page);
    await deleteExpense(page);
    await expect(page.locator(".adm-alert--ok")).toContainText("Despesa excluída");
    await expect(page.locator(".fin-table-row").filter({ hasText: EXPENSE.description })).not.toBeVisible();
  });
});

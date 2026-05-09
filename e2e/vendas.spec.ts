import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { login } from "./helpers/auth";

const SALE = {
  make: "E2E-HONDA",
  model: "E2E-CIVIC",
  year: "2023",
  client: "E2E Cliente Venda",
  price: "89000",
  cost: "72000",
};

async function openCreateForm(page: Page) {
  const form = page.locator("details.adm-form-card");
  await form.locator("summary").click();
  return form;
}

async function createSale(page: Page) {
  await page.goto("/admin/vendas");
  const form = await openCreateForm(page);
  await form.locator('[name="make"]').fill(SALE.make);
  await form.locator('[name="model"]').fill(SALE.model);
  await form.locator('[name="year"]').fill(SALE.year);
  await form.locator('[name="client_name"]').fill(SALE.client);
  await form.locator('[name="sale_price"]').fill(SALE.price);
  await form.locator('[name="cost_price"]').fill(SALE.cost);
  await page.getByRole("button", { name: "Registrar Venda" }).click();
  await page.waitForURL(/success=created/);
}

async function findAndExpandSaleRow(page: Page, text: string) {
  const row = page.locator(".adm-table-row").filter({ hasText: text });
  await row.locator("summary").click();
  return row;
}

async function deleteSale(page: Page) {
  const row = await findAndExpandSaleRow(page, SALE.make);
  await row.locator(".adm-row-delete button").click();
  await page.waitForURL(/success=deleted/);
}

test.describe("Vendas", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("criar venda aparece no histórico", async ({ page }) => {
    await createSale(page);
    await expect(page.locator(".adm-table-row").filter({ hasText: SALE.make })).toBeVisible();
    await expect(page.locator(".adm-alert--ok")).toContainText("Venda registrada");
    await deleteSale(page);
  });

  test("editar venda atualiza o preço", async ({ page }) => {
    await createSale(page);
    const row = await findAndExpandSaleRow(page, SALE.make);
    await row.locator('form.adm-form [name="sale_price"]').fill("95000");
    await row.locator("form.adm-form .adm-form-foot button").click();
    await page.waitForURL(/success=updated/);
    await expect(page.locator(".adm-alert--ok")).toContainText("Venda atualizada");
    await deleteSale(page);
  });

  test("excluir venda remove do histórico", async ({ page }) => {
    await createSale(page);
    await deleteSale(page);
    await expect(page.locator(".adm-alert--ok")).toContainText("Venda excluída");
    await expect(page.locator(".adm-table-row").filter({ hasText: SALE.make })).not.toBeVisible();
  });
});

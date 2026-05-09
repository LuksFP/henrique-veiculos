import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { login } from "./helpers/auth";

const MAKE = "E2E-TOYOTA";
const MODEL = "E2E-COROLLA";
const MODEL_EDITED = "E2E-COROLLA-EDIT";

async function openCreateForm(page: Page) {
  const form = page.locator("details.adm-form-card");
  await form.locator("summary").click();
  return form;
}

async function createVehicle(page: Page, make = MAKE, model = MODEL) {
  await page.goto("/admin/veiculos");
  const form = await openCreateForm(page);
  await form.locator('[name="make"]').fill(make);
  await form.locator('[name="model"]').fill(model);
  await form.locator('[name="price"]').fill("R$ 75.990");
  await page.getByRole("button", { name: "Salvar Veículo" }).click();
  await page.waitForURL(/success=created/);
}

async function findAndExpandRow(page: Page, text: string) {
  await page.fill(".adm-search-input", text);
  const row = page.locator(".adm-table-row").filter({ hasText: text }).first();
  await row.locator("summary").click();
  return row;
}

async function deleteVehicle(page: Page, text: string) {
  const row = await findAndExpandRow(page, text);
  await row.locator(".adm-row-delete button").click();
  await page.waitForURL(/success=deleted/);
}

test.describe("Veículos", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("criar veículo e aparecer na tabela", async ({ page }) => {
    await createVehicle(page);
    await page.fill(".adm-search-input", MAKE);
    await expect(page.locator(".adm-table-row").filter({ hasText: MAKE }).first()).toBeVisible();
    await deleteVehicle(page, MAKE);
    await expect(page.locator(".adm-alert--ok")).toContainText("Excluído");
  });

  test("busca por marca filtra corretamente", async ({ page }) => {
    await createVehicle(page);
    await page.goto("/admin/veiculos");
    await page.fill(".adm-search-input", MAKE);
    await expect(page.locator(".adm-table-row").filter({ hasText: MAKE }).first()).toBeVisible();
    await expect(page.locator(".adm-search-bar .adm-search-count")).toContainText("resultado");
    await deleteVehicle(page, MAKE);
  });

  test("busca sem resultado exibe mensagem vazia", async ({ page }) => {
    await page.goto("/admin/veiculos");
    await page.fill(".adm-search-input", "MARCA-INEXISTENTE-ZZZ999");
    await expect(page.getByText(/Nenhum resultado para/)).toBeVisible();
  });

  test("editar veículo atualiza na tabela", async ({ page }) => {
    await createVehicle(page);
    const row = await findAndExpandRow(page, MAKE);
    await row.locator('form.adm-form [name="model"]').fill(MODEL_EDITED);
    await row.locator("form.adm-form .adm-form-foot button").click();
    await page.waitForURL(/success=updated/);
    await expect(page.locator(".adm-alert--ok")).toContainText("Atualizado");
    await deleteVehicle(page, MODEL_EDITED);
  });
});

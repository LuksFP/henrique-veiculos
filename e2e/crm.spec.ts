import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { login } from "./helpers/auth";

const LEAD_NAME = "E2E Lead Teste";
const LEAD_PHONE = "(63) 99999-0099";

async function createLead(page: Page, name = LEAD_NAME, status = "novo") {
  await page.goto("/admin/crm");
  const form = page.locator("details.adm-form-card");
  await form.locator("summary").click();
  await form.locator('[name="name"]').fill(name);
  await form.locator('[name="phone"]').fill(LEAD_PHONE);
  await form.locator('[name="status"]').selectOption(status);
  await page.getByRole("button", { name: "Cadastrar Lead" }).click();
  await page.waitForURL(/success=created/);
}

async function selectLead(page: Page, name: string) {
  const row = page.locator(".crm-row").filter({ hasText: name });
  await row.click();
  await expect(page.locator(".crm-detail-body")).toBeVisible();
}

async function deleteLead(page: Page, name: string) {
  await selectLead(page, name);
  await page.locator(".crm-detail-body").getByRole("button", { name: "Excluir lead" }).click();
  await page.waitForURL(/success=deleted/);
}

test.describe("CRM", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("criar lead aparece na lista", async ({ page }) => {
    await createLead(page);
    await expect(page.locator(".crm-row").filter({ hasText: LEAD_NAME })).toBeVisible();
    await deleteLead(page, LEAD_NAME);
    await expect(page.locator(".adm-alert--ok")).toContainText("excluído");
  });

  test("filtro por status exibe apenas leads do status", async ({ page }) => {
    await createLead(page, LEAD_NAME, "novo");
    await page.locator(".crm-chip").filter({ hasText: "Novos" }).click();
    await expect(page.locator(".crm-row").filter({ hasText: LEAD_NAME })).toBeVisible();
    const contagem = page.locator(".crm-chip.is-active .crm-chip-count");
    await expect(contagem).not.toHaveText("0");
    await deleteLead(page, LEAD_NAME);
  });

  test("selecionar lead abre painel de detalhes", async ({ page }) => {
    await createLead(page);
    await selectLead(page, LEAD_NAME);
    await expect(page.locator(".crm-detail-body")).toBeVisible();
    await expect(page.locator(".adm-card-title").filter({ hasText: LEAD_NAME })).toBeVisible();
    await deleteLead(page, LEAD_NAME);
  });

  test("mudar status do lead persiste após salvar", async ({ page }) => {
    await createLead(page, LEAD_NAME, "novo");
    await selectLead(page, LEAD_NAME);
    await page.locator(".crm-detail-body").locator('[name="status"]').selectOption("proposta");
    await page.locator(".crm-detail-body").getByRole("button", { name: "Salvar" }).click();
    await page.waitForURL(/success=updated/);
    await expect(page.locator(".crm-row").filter({ hasText: LEAD_NAME }).locator(".adm-tag")).toContainText("Proposta");
    await deleteLead(page, LEAD_NAME);
  });

  test("excluir lead remove da lista", async ({ page }) => {
    await createLead(page);
    await deleteLead(page, LEAD_NAME);
    await expect(page.locator(".crm-row").filter({ hasText: LEAD_NAME })).not.toBeVisible();
  });
});

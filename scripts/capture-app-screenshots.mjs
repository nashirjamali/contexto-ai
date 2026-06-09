import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.join(__dirname, "..", "docs");
const baseUrl = "http://localhost:3000";
const apiUrl = "http://localhost:3001/api";
const email = "test@mail.com";
const password = "testing123";

async function main() {
  await mkdir(docsDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(`${baseUrl}/login`);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/workspaces\//, { timeout: 15000 });
  await page.waitForTimeout(1500);

  const workspaceId = page.url().match(/workspaces\/([^/]+)/)?.[1];
  if (!workspaceId) throw new Error("Could not resolve workspace id after login");

  const token = await page.evaluate(() => localStorage.getItem("contexto_token"));
  const docsRes = await fetch(`${apiUrl}/workspaces/${workspaceId}/documents`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const documents = await docsRes.json();
  const documentId = documents[0]?.id;

  await page.goto(`${baseUrl}/workspaces/${workspaceId}`);
  await page.waitForSelector("text=Documents", { timeout: 10000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(docsDir, "upload-documents.png") });

  if (documentId) {
    await page.goto(`${baseUrl}/workspaces/${workspaceId}/documents/${documentId}`);
    await page.waitForSelector("text=Chat", { timeout: 10000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(docsDir, "document-chat.png") });
  }

  await page.goto(`${baseUrl}/workspaces/${workspaceId}/settings/billing`);
  await page.waitForSelector("text=Billing", { timeout: 10000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(docsDir, "billing.png") });

  await browser.close();
  console.log("Screenshots saved to docs/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

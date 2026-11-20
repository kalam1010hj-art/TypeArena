import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { preview } from "vite";

test("desktop result, history, theme, deep links and mobile navigation", async () => {
  const server = await preview({ preview: { host: "127.0.0.1", port: 0 } });
  let browser;
  try {
    browser = await chromium.launch({
      executablePath: process.env.CHROMIUM_PATH || undefined,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const origin = "http://127.0.0.1:" + server.httpServer.address().port;
    await page.goto(origin);
    await page
      .getByRole("link", { name: "Start Typing Test", exact: true })
      .first()
      .click();
    await page
      .getByRole("combobox", { name: "Mode", exact: true })
      .selectOption("Custom");
    await page.getByLabel("Custom passage").fill("hello");
    await page
      .getByLabel("Typing input")
      .pressSequentially("hello", { delay: 50 });
    await page.getByText("Session complete").waitFor();
    await page.getByText("No mistyped characters.").waitFor();
    await page.getByRole("link", { name: "History", exact: true }).click();
    await page.getByText(/100% accuracy/).waitFor();
    await page.getByRole("button", { name: "Switch theme" }).click();
    await page.reload();
    assert.equal(
      await page.locator("html").getAttribute("data-theme"),
      "light",
    );
    await page.setViewportSize({ width: 360, height: 780 });
    await page.getByRole("button", { name: "Toggle menu" }).click();
    await page.getByRole("link", { name: "Home", exact: true }).click();
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await page.getByRole("link", { name: /Classic/ }).click();
    assert.equal(
      await page
        .getByRole("button", { name: "1m", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    await page.reload();
    await page.getByRole("heading", { name: "1-minute typing test" }).waitFor();
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    await new Promise((resolve) => server.httpServer.close(resolve));
  }
});

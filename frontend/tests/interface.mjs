import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { JSDOM } from "jsdom";
const tick = () => new Promise((resolve) => setTimeout(resolve, 30));
test("built guest interface supports navigation, custom passage, scoring and history", async () => {
  const html = await readFile("dist/index.html", "utf8");
  const dom = new JSDOM(html, {
    url: "https://example.test",
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  try {
    const { window: w } = dom,
      d = w.document;
    w.scrollTo = () => {};
    const script = d.querySelector("script[type=module]").getAttribute("src");
    w.eval(await readFile("dist" + script, "utf8"));
    await tick();
    d.querySelector('a[href="/typing-test"]').click();
    await tick();
    assert.equal(d.querySelector("h1").textContent, "Typing Speed Test");
    const mode = d.querySelector("select");
    mode.value = "Custom";
    mode.dispatchEvent(new w.Event("change", { bubbles: true }));
    await tick();
    const setText = async (field, text) => {
      Object.getOwnPropertyDescriptor(
        w.HTMLTextAreaElement.prototype,
        "value",
      ).set.call(field, text);
      field.dispatchEvent(new w.Event("input", { bubbles: true }));
      await tick();
    };
    await setText(d.querySelector("label textarea"), "abc");
    const field = d.querySelector('[aria-label="Typing input"]');
    assert.equal(field.disabled, false);
    await setText(field, "a");
    await setText(field, "abc");
    assert.match(d.querySelector("main").textContent, /Session complete/);
    d.querySelector('nav a[href="/history"]').click();
    await tick();
    assert.match(d.querySelector("main").textContent, /100% accuracy/);
    d.querySelector('[aria-label="Switch theme"]').click();
    await tick();
    assert.equal(d.documentElement.dataset.theme, "light");
    d.querySelector('[aria-label="Toggle menu"]').click();
    await tick();
    assert.equal(d.querySelector("nav").dataset.open, "true");
  } finally {
    dom.window.close();
  }
});

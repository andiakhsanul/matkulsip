import { chromium } from "playwright";

const browser = await chromium.launch({
  executablePath:
    process.env.HOME +
    "/Library/Caches/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-arm64/chrome-headless-shell",
  args: ["--no-sandbox", "--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
await page.goto("http://127.0.0.1:4173/matkulsip/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(4000);

const switches = page.getByRole("switch");
await switches.nth(1).scrollIntoViewIfNeeded();
await switches.nth(1).click();
await page.waitForTimeout(900);
const checked = [];
for (let i = 0; i < 7; i += 1) {
  checked.push(await switches.nth(i).getAttribute("aria-checked"));
}
const legend = await page.locator("aside").first().innerText();

await switches.nth(5).scrollIntoViewIfNeeded();
await switches.nth(5).click();
await page.waitForTimeout(900);
await page.getByRole("tab", { name: "Filter" }).first().click();
await page.waitForTimeout(500);
await page.getByRole("button", { name: /Harjamukti/ }).first().click();
await page.waitForTimeout(500);
const filtered = await page.locator("aside").first().innerText();

console.log(
  JSON.stringify(
    {
      checkedAfterLandcover: checked,
      legendSnippet: legend.slice(0, 300),
      filteredSnippet: filtered.slice(0, 420),
      errors,
    },
    null,
    2
  )
);
await page.screenshot({ path: "/tmp/bgi-factor-filter.png" });
await browser.close();

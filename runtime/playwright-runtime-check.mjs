import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const playwright = require("/Users/bropro/.npm/_npx/e41f203b7505f1fb/node_modules/playwright");
const { chromium } = playwright;

const baseURL = "http://127.0.0.1:8765/";
const outputDir = fileURLToPath(new URL("./screenshots/", import.meta.url));
const states = [1, 2, 3, 4, 5, 6, 7];
const result = {
  desktop: { screenshots: 0, hashes: 0, scroll: false },
  mobile: { screenshots: 0, hashes: 0, scroll: false },
  click: false,
  domStateChange: false,
};

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch();

async function runViewport(name, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: name === "mobile" ? 2 : 1 });
  await page.goto(baseURL, { waitUntil: "networkidle" });

  for (const state of states) {
    await page.goto(`${baseURL}#sc-0${state}`, { waitUntil: "networkidle" });
    if (page.url().endsWith(`#sc-0${state}`)) result[name].hashes += 1;
    await page.screenshot({ path: `${outputDir}/${name}-sc-0${state}.png` });
    result[name].screenshots += 1;
  }

  await page.goto(`${baseURL}#sc-02`, { waitUntil: "networkidle" });
  const firstTab = page.locator('#sc-02 [role="tab"]').first();
  const secondTab = page.locator('#sc-02 [role="tab"]').nth(1);
  if (await firstTab.count() && await secondTab.count()) {
    const before = await firstTab.getAttribute("aria-selected");
    await secondTab.click();
    const after = await secondTab.getAttribute("aria-selected");
    result.click = result.click || (before === "true" && after === "true");
    result.domStateChange = result.domStateChange || (await firstTab.getAttribute("aria-selected")) === "false";
  }

  await page.evaluate(() => window.scrollTo(0, 900));
  result[name].scroll = await page.evaluate(() => window.scrollY > 0);
  await page.close();
}

try {
  await runViewport("desktop", { width: 1280, height: 800 });
  await runViewport("mobile", { width: 390, height: 844 });
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}

const passed = result.desktop.screenshots === 7 && result.mobile.screenshots === 7
  && result.desktop.hashes === 7 && result.mobile.hashes === 7
  && result.desktop.scroll && result.mobile.scroll && result.click && result.domStateChange;
process.exitCode = passed ? 0 : 1;


const puppeteer = require("puppeteer-core");

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "http://localhost:3000";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1360, height: 900 });
  page.on("pageerror", (e) => console.log("[pageerror]", e.message));

  console.log("=== search: type 'ac' ===");
  await page.goto(`${BASE}/services`, { waitUntil: "networkidle2", timeout: 60000 });
  await page.waitForSelector("main h3", { timeout: 20000 });
  const input = await page.$('input[type="search"]');
  await input.click({ clickCount: 3 });
  await input.type("ac", { delay: 120 });
  await new Promise((r) => setTimeout(r, 1600));

  console.log("url:", page.url());
  const titles = await page.$$eval("main h3", (els) => els.map((e) => e.textContent.trim()));
  console.log("cards:", titles, `(n=${titles.length})`);
  const okSearch = page.url().includes("search=ac") && titles.length > 0 &&
    titles.every((t) => t.toLowerCase().includes("ac"));
  console.log("SEARCH WORKS:", okSearch);

  console.log("\n=== dropdown popup background ===");
  await page.goto(`${BASE}/services`, { waitUntil: "networkidle2", timeout: 60000 });
  await page.waitForSelector('select[aria-label="Filter by category"]', { timeout: 20000 });
  const bg = await page.evaluate(() => {
    const sel = document.querySelector('select[aria-label="Filter by category"]');
    sel.showPicker();
    const cs = getComputedStyle(sel, "::picker(select)");
    return { pickerBg: cs.backgroundColor, selectBg: getComputedStyle(sel).backgroundColor };
  });
  console.log("computed:", JSON.stringify(bg));
  const opaque = bg.pickerBg && !/rgba\([^)]*,\s*0(\.0+)?\)/.test(bg.pickerBg) && bg.pickerBg !== "transparent";
  console.log("PICKER OPAQUE:", opaque, "(select control keeps translucent:", bg.selectBg.includes("0.5"), ")");

  await page.screenshot({ path: "scripts/ui-verify-picker.png" });
  await browser.close();
  console.log("\nRESULT:", okSearch && opaque ? "ALL GOOD" : "FAILURES REMAIN");
  process.exit(okSearch && opaque ? 0 : 1);
})().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});

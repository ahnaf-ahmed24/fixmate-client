
const puppeteer = require("puppeteer-core");

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "http://localhost:3000";

async function shoot(browser, themeName, url, file) {
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({ width: 1360, height: 900 });
  await page.evaluateOnNewDocument((t) => {
    localStorage.setItem("fixmate-theme", t);
    document.documentElement.setAttribute("data-theme", t);
  }, themeName);
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
 
  await page
    .waitForFunction(() => [...document.images].every((i) => i.complete), { timeout: 20000 })
    .catch(() => {});
  await new Promise((r) => setTimeout(r, 800));
  const broken = await page.evaluate(() =>
    [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src)
  );
  if (broken.length) console.log(`[broken images] ${file}:`, broken);
  await page.screenshot({ path: file });
  await page.close();
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });
  await shoot(browser, "fixmate", `${BASE}/`, "scripts/theme-light.png");
  await shoot(browser, "fixmate-dark", `${BASE}/`, "scripts/theme-dark.png");
  await shoot(browser, "fixmate-dark", `${BASE}/services`, "scripts/theme-dark-services.png");
  await shoot(browser, "fixmate", `${BASE}/services`, "scripts/theme-light-services.png");
  await shoot(browser, "fixmate", `${BASE}/about`, "scripts/theme-light-about.png");
  await browser.close();
  console.log("shots saved: theme-light, theme-dark, theme-dark-services, theme-light-services, theme-light-about");
})().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});

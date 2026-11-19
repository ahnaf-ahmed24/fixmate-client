const puppeteer = require("puppeteer-core");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "http://localhost:3000";

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: true, args: ["--no-sandbox", "--disable-gpu"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });

  await page.goto(`${BASE}/sign-in`, { waitUntil: "networkidle2", timeout: 60000 });
  await page.type('input[type="email"]', "tanvir@fixmate.com");
  await page.type('input[type="password"]', "Cust@123");
  await page.evaluate(() => document.querySelector("form").requestSubmit());
  await new Promise((r) => setTimeout(r, 6000));

  await page.goto(`${BASE}/dashboard/customer/bookings`, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 4000));
  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => null),
    page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) => /Pay now/i.test(x.textContent));
      b && b.click();
    }),
  ]);
  await new Promise((r) => setTimeout(r, 8000));
  console.log("url:", page.url().slice(0, 90));

  for (const f of page.frames()) {
    const u = f.url().slice(0, 90);
    let info = "";
    try {
      info = await f.evaluate(() => ({
        text: (document.body && document.body.innerText || "").replace(/\s+/g, " ").slice(0, 200),
        inputs: [...document.querySelectorAll("input")].map((i) => i.name || i.type || i.id).slice(0, 12),
        buttons: [...document.querySelectorAll("button")].map((b) => b.innerText.trim()).filter(Boolean).slice(0, 8),
        selects: [...document.querySelectorAll("select")].length,
      }));
    } catch (e) {
      info = "(cross-origin: " + e.message.slice(0, 50) + ")";
    }
    console.log(`\n[frame] ${u}\n  ${JSON.stringify(info)}`);
  }

  await page.screenshot({ path: "scripts/tmp-stripe2.png" });
  await browser.close();
})().catch((e) => { console.error("FATAL:", e.message); process.exit(1); });

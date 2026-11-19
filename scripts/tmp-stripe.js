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
    page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 }).catch(() => null),
    page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) => /Pay now/i.test(x.textContent));
      b && b.click();
    }),
  ]);
  await new Promise((r) => setTimeout(r, 8000));
  console.log("url:", page.url().slice(0, 100));

  const dump = async (label) => {
    const info = await page.evaluate(() => ({
      text: document.body.innerText.replace(/\s+/g, " ").slice(0, 500),
      inputs: [...document.querySelectorAll("input")].map((i) => ({ name: i.name || i.id || i.type, ph: i.placeholder })),
      selects: [...document.querySelectorAll("select")].map((s) => ({ name: s.name, opts: [...s.options].map((o) => o.text).slice(0, 8) })),
      buttons: [...document.querySelectorAll("button")].map((b) => b.innerText.trim()).filter(Boolean).slice(0, 15),
      iframes: [...document.querySelectorAll("iframe")].map((f) => (f.title || f.name || "").slice(0, 40)),
    }));
    console.log(`\n--- ${label} ---`);
    console.log(JSON.stringify(info, null, 1));
  };

  await dump("initial");

  // try picking a currency if the picker is up
  const clicked = await page.evaluate(() => {
    const opts = [...document.querySelectorAll("button, [role=button], label, li, option")].filter((e) => /USD|BDT|\$|USD\s*\(/i.test(e.innerText || ""));
    if (opts.length) { opts[0].click(); return (opts[0].innerText || "").trim().slice(0, 60); }
    const sel = document.querySelector("select");
    if (sel) { sel.selectedIndex = 0; sel.dispatchEvent(new Event("change", { bubbles: true })); return "select:" + sel.name; }
    return null;
  });
  console.log("\nclicked:", JSON.stringify(clicked));
  await new Promise((r) => setTimeout(r, 6000));
  await dump("after currency interaction");

  await page.screenshot({ path: "scripts/tmp-stripe.png" });
  await browser.close();
})().catch((e) => { console.error("FATAL:", e.message); process.exit(1); });

const puppeteer = require("puppeteer-core");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "http://localhost:3000";

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: true, args: ["--no-sandbox", "--disable-gpu"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });
  page.on("pageerror", (e) => console.log("  [pageerror]", e.message.slice(0, 250)));
  page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) console.log("  [console.error]", m.text().slice(0, 250)); });

  await page.goto(`${BASE}/sign-in`, { waitUntil: "networkidle2", timeout: 60000 });
  await page.type('input[type="email"]', "tanvir@fixmate.com");
  await page.type('input[type="password"]', "Cust@123");
  await page.evaluate(() => document.querySelector("form").requestSubmit());
  await new Promise((r) => setTimeout(r, 6000));

  const dump = async (path, label) => {
    await page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 3500));
    const info = await page.evaluate(() => ({
      broke: document.body.innerText.includes("Something broke on our side"),
      text: document.body.innerText.replace(/\s+/g, " "),
    }));
    console.log(`\n=== ${label} ${path} (${info.broke ? "ERROR BOUNDARY" : "ok"}) ===`);
    console.log(info.text.slice(0, 900));
  };

  await dump("/dashboard/customer/bookings", "bookings");
  await dump("/dashboard/customer/payments", "payments");
  await dump("/dashboard/customer", "dashboard");

  // focus on the paid booking card
  await page.goto(`${BASE}/dashboard/customer/bookings`, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3500));
  const card = await page.evaluate(() => {
    const a = [...document.querySelectorAll("article")].find((x) => /Desktop PC Build/i.test(x.innerText));
    if (!a) return null;
    return {
      badges: [...a.querySelectorAll(".badge, span")].map((b) => b.innerText.trim()).filter((t) => t && t.length < 30).slice(0, 12),
      timeline: [...a.querySelectorAll(".step")].map((s) => s.innerText.replace(/\s+/g, " ").trim()),
      buttons: [...a.querySelectorAll("button")].map((b) => b.innerText.trim()),
      hasUndefined: /undefined|null/.test(a.innerText),
    };
  });
  console.log("\n=== paid booking card ===");
  console.log(JSON.stringify(card, null, 1));

  await browser.close();
})().catch((e) => { console.error("FATAL:", e.message); process.exit(1); });

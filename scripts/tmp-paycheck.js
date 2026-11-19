const puppeteer = require("puppeteer-core");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "http://localhost:3000";
let failures = 0;
const check = (l, c, x = "") => { console.log(`  ${c ? "PASS" : "FAIL"} — ${l}${x ? ` (${x})` : ""}`); if (!c) failures++; };

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: true, args: ["--no-sandbox", "--disable-gpu"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });
  page.on("pageerror", (e) => { failures++; console.log("  [pageerror]", e.message.slice(0, 250)); });

  // public payment landing page (was 404)
  await page.goto(`${BASE}/payment`, { waitUntil: "networkidle2", timeout: 60000 });
  const landing = await page.evaluate(() => document.body.innerText.replace(/\s+/g, " ").slice(0, 300));
  console.log("\n=== /payment ===\n ", landing);
  check("payment landing page renders", !/404|not found/i.test(landing));
  check("landing explains how to pay", /Pay when the job is done|Where do I pay/i.test(landing));

  // sign in as the customer who has an unpaid completed job
  await page.goto(`${BASE}/sign-in`, { waitUntil: "networkidle2", timeout: 60000 });
  await page.type('input[type="email"]', "tanvir@fixmate.com");
  await page.type('input[type="password"]', "Cust@123");
  await page.evaluate(() => document.querySelector("form").requestSubmit());
  await new Promise((r) => setTimeout(r, 6000));

  await page.goto(`${BASE}/dashboard/customer/payments`, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 4000));
  const pay = await page.evaluate(() => ({
    text: document.body.innerText.replace(/\s+/g, " ").slice(0, 500),
    payBtns: [...document.querySelectorAll("button")].filter((b) => /Pay now/i.test(b.textContent)).length,
    broke: document.body.innerText.includes("Something broke on our side"),
  }));
  console.log("\n=== /dashboard/customer/payments ===\n ", pay.text);
  check("page renders without crashing", !pay.broke);
  check("'Awaiting payment' section with Pay now button", pay.payBtns > 0, `count=${pay.payBtns}`);

  // pay button should start a Stripe checkout
  const [resp] = await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => null),
    page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) => /Pay now/i.test(x.textContent));
      b && b.click();
    }),
  ]);
  await new Promise((r) => setTimeout(r, 5000));
  const url = page.url();
  console.log("\n=== after clicking Pay now ===\n  landed on:", url.slice(0, 100));
  check("redirected to Stripe Checkout", /stripe\.com/.test(url), url.slice(0, 60));

  // bookings page: paid tab + receipt link still present for an already-paid job
  await page.goto(`${BASE}/dashboard/customer/bookings`, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 4000));
  const bookings = await page.evaluate(() => ({
    tabs: [...document.querySelectorAll("button")].map((b) => b.innerText.trim()).filter(Boolean).slice(0, 10),
    receiptLinks: [...document.querySelectorAll("a")].filter((a) => /view receipt/i.test(a.textContent)).length,
    paidBadges: [...document.querySelectorAll("span")].filter((s) => s.innerText.trim() === "Paid").length,
    broke: document.body.innerText.includes("Something broke on our side"),
  }));
  console.log("\n=== /dashboard/customer/bookings ===\n ", JSON.stringify(bookings));
  check("page renders without crashing", !bookings.broke);
  check("a 'paid' status tab exists", bookings.tabs.some((t) => /paid/i.test(t)));
  check("'Paid — view receipt' link shows for paid jobs", bookings.receiptLinks > 0, `count=${bookings.receiptLinks}`);
  check("'Paid' badge renders", bookings.paidBadges > 0, `count=${bookings.paidBadges}`);

  await browser.close();
  console.log("\nRESULT:", failures === 0 ? "ALL CHECKS PASSED" : `${failures} FAILURES`);
  process.exit(failures === 0 ? 0 : 1);
})().catch((e) => { console.error("FATAL:", e.message); process.exit(1); });

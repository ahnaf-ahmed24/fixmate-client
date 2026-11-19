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
  page.on("console", (m) => {
    if (m.type() === "error" && !/Failed to load resource/.test(m.text())) { failures++; console.log("  [console.error]", m.text().slice(0, 250)); }
  });

  await page.goto(`${BASE}/sign-in`, { waitUntil: "networkidle2", timeout: 60000 });
  await page.type('input[type="email"]', "tanvir@fixmate.com");
  await page.type('input[type="password"]', "Cust@123");
  await page.evaluate(() => document.querySelector("form").requestSubmit());
  await new Promise((r) => setTimeout(r, 6000));
  console.log("signed in →", page.url());

  // --- where is the pay button? ---
  console.log("\n=== /dashboard/customer/bookings ===");
  await page.goto(`${BASE}/dashboard/customer/bookings`, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 4000));
  const payInfo = await page.evaluate(() => {
    const payBtns = [...document.querySelectorAll("button")].filter((b) => /Pay now/i.test(b.textContent));
    const cards = [...document.querySelectorAll("article")].map((a) => ({
      title: a.querySelector("h2")?.innerText,
      badges: [...a.querySelectorAll(".badge")].map((b) => b.innerText.trim()).filter(Boolean),
      hasPay: /Pay now/i.test(a.innerText),
    }));
    return { payCount: payBtns.length, cards, text: document.body.innerText.slice(0, 200) };
  });
  check("'Pay now' button exists for the completed booking", payInfo.payCount > 0, `count=${payInfo.payCount}`);
  console.log("  cards:", JSON.stringify(payInfo.cards, null, 1));

  // --- click it and follow to Stripe ---
  console.log("\n=== click Pay now ===");
  const [resp] = await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => null),
    page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) => /Pay now/i.test(x.textContent));
      b && b.click();
    }),
  ]);
  await new Promise((r) => setTimeout(r, 6000));
  const stripeUrl = page.url();
  console.log("  landed on:", stripeUrl.slice(0, 110));
  check("redirected to Stripe Checkout", /stripe\.com/.test(stripeUrl), stripeUrl.slice(0, 60));
  const stripeInfo = await page.evaluate(() => ({
    title: document.title,
    hasCardField: !!document.querySelector('input[name="cardNumber"], input[data-elements-stable-field-name="cardNumber"]'),
    text: document.body.innerText.replace(/\s+/g, " ").slice(0, 300),
  }));
  console.log("  stripe page:", JSON.stringify(stripeInfo));
  check("Stripe checkout rendered with amount", /\$55\.00|\$55/.test(stripeInfo.text), stripeInfo.text.slice(0, 120));
  check("card number field present", stripeInfo.hasCardField);

  // --- back to the cancel page ---
  console.log("\n=== /payment/cancel ===");
  await page.goto(`${BASE}/payment/cancel?bookingId=6afc63177c82eeb39169c798`, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3000));
  const cancelInfo = await page.evaluate(() => ({
    broke: document.body.innerText.includes("Something broke on our side"),
    text: document.body.innerText.replace(/\s+/g, " ").slice(0, 350),
  }));
  check("cancel page renders", !cancelInfo.broke, cancelInfo.text.slice(0, 160));

  // --- success page with a bogus session (should fail gracefully, not crash) ---
  console.log("\n=== /payment/success (bogus session) ===");
  await page.goto(`${BASE}/payment/success?session_id=cs_test_bogus`, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 4000));
  const okInfo = await page.evaluate(() => ({
    broke: document.body.innerText.includes("Something broke on our side"),
    text: document.body.innerText.replace(/\s+/g, " ").slice(0, 350),
  }));
  check("success page renders without crashing", !okInfo.broke, okInfo.text.slice(0, 180));

  // --- payment history page ---
  console.log("\n=== /dashboard/customer/payments ===");
  await page.goto(`${BASE}/dashboard/customer/payments`, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3500));
  const hist = await page.evaluate(() => ({
    broke: document.body.innerText.includes("Something broke on our side"),
    text: document.body.innerText.replace(/\s+/g, " ").slice(0, 400),
  }));
  check("payment history renders", !hist.broke, hist.text.slice(0, 200));

  await browser.close();
  console.log("\nRESULT:", failures === 0 ? "PAYMENT FLOW OK" : `${failures} FAILURES`);
  process.exit(failures === 0 ? 0 : 1);
})().catch((e) => { console.error("FATAL:", e.message); process.exit(1); });

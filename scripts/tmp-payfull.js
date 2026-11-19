const puppeteer = require("puppeteer-core");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "http://localhost:3000";

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: true, args: ["--no-sandbox", "--disable-gpu"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });
  page.on("pageerror", (e) => console.log("  [pageerror]", e.message.slice(0, 200)));

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
  console.log("stripe url:", page.url().slice(0, 80));

  // if a Link overlay is open from an earlier attempt, dismiss it
  const dismissed = await page.evaluate(() => {
    const b = [...document.querySelectorAll("button, a")].find((x) => /Cancel payment/i.test(x.innerText));
    if (b) { b.click(); return true; }
    return false;
  });
  if (dismissed) { console.log("dismissed Link overlay"); await new Promise((r) => setTimeout(r, 3000)); }

  // pick USD so the charged amount matches $55.00
  const currencyFrame = page.frames().find((f) => f.url().includes("currency-selector"));
  if (currencyFrame) {
    const picked = await currencyFrame.evaluate(() => {
      const inputs = [...document.querySelectorAll("input")];
      const usd = inputs.find((i) => (i.value || "").toUpperCase() === "USD");
      if (usd) { usd.click(); usd.focus(); usd.dispatchEvent(new Event("change", { bubbles: true })); return usd.value; }
      return inputs.map((i) => i.value);
    }).catch((e) => "err:" + e.message);
    console.log("currency picked:", JSON.stringify(picked));
    await new Promise((r) => setTimeout(r, 2500));
  }

  // fill the card form
  const cardFrame = page.frames().find((f) => f.url().includes("elements-inner-habanero"));
  if (!cardFrame) { console.log("NO CARD FRAME"); process.exit(1); }

  await cardFrame.evaluate(() => {
    const email = document.querySelector('input[name="email"]');
    if (email && !email.value) { email.value = "tanvir@fixmate.com"; email.dispatchEvent(new Event("input", { bubbles: true })); }
  });

  await cardFrame.type('input[name="number"]', "4242424242424242", { delay: 40 });
  await new Promise((r) => setTimeout(r, 500));
  await cardFrame.type('input[name="expiry"]', "1234", { delay: 40 });
  await new Promise((r) => setTimeout(r, 500));
  await cardFrame.type('input[name="cvc"]', "123", { delay: 40 });
  await new Promise((r) => setTimeout(r, 500));
  await cardFrame.type('input[name="name"]', "Tanvir Islam", { delay: 30 });
  await new Promise((r) => setTimeout(r, 1500));

  const filled = await cardFrame.evaluate(() => ({
    number: document.querySelector('input[name="number"]')?.value,
    expiry: document.querySelector('input[name="expiry"]')?.value,
    cvc: document.querySelector('input[name="cvc"]')?.value,
    name: document.querySelector('input[name="name"]')?.value,
  }));
  console.log("filled:", JSON.stringify(filled));

  // click the real "Pay" button (exact match — "Pay with" is Stripe Link)
  const payBtn = await cardFrame.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find(
      (x) => x.innerText.trim() === "Pay" && !x.disabled
    );
    if (!b) return [...document.querySelectorAll("button")].map((x) => x.innerText.trim());
    b.click();
    return "clicked:" + b.innerText.trim();
  });
  console.log("clicked:", JSON.stringify(payBtn));

  // wait for redirect back to the app (or an error on the Stripe page)
  let landed = "";
  try {
    await page.waitForFunction(
      () => location.hostname === "localhost" || /error|declined/i.test(document.body.innerText),
      { timeout: 45000 }
    );
  } catch {}
  await new Promise((r) => setTimeout(r, 12000));
  landed = page.url();
  console.log("\nlanded:", landed.slice(0, 130));

  const txt = await page.evaluate(() => document.body.innerText.replace(/\s+/g, " ").slice(0, 700));
  console.log("page text:", txt);

  await page.screenshot({ path: "scripts/tmp-paid.png" });
  await browser.close();
})().catch((e) => { console.error("FATAL:", e.message); process.exit(1); });

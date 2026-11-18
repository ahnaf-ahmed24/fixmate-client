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
  await page.setViewport({ width: 1440, height: 1000 });
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("console: " + m.text().slice(0, 200));
  });

  await page.goto(BASE + "/", { waitUntil: "networkidle2", timeout: 60000 });

  for (const theme of ["fixmate", "fixmate-dark"]) {
    await page.evaluate((t) => {
      localStorage.setItem("fixmate-theme", t);
      document.documentElement.setAttribute("data-theme", t);
    }, theme);
    await new Promise((r) => setTimeout(r, 800));

    const out = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const btn = document.querySelector('a[href="/sign-up"]');
      const body = getComputedStyle(document.body);
      return {
        theme: document.documentElement.getAttribute("data-theme"),
        primary: cs.getPropertyValue("--color-primary").trim(),
        secondary: cs.getPropertyValue("--color-secondary").trim(),
        accent: cs.getPropertyValue("--color-accent").trim(),
        bodyBg: body.backgroundColor,
        bodyFg: body.color,
        btnBg: btn ? getComputedStyle(btn).backgroundColor : null,
        brokenImgs: [...document.images].filter((i) => !i.naturalWidth).length,
        totalImgs: document.images.length,
      };
    });
    console.log(JSON.stringify(out, null, 2));
  }


  for (const path of ["/", "/services", "/about"]) {
    await page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 2500));
    const r = await page.evaluate(() => {
      const imgs = [...document.images];
      return {
        total: imgs.length,
        broken: imgs.filter((i) => !i.naturalWidth).map((i) => i.src),
        hidden: imgs.filter((i) => getComputedStyle(i).display === "none").length,
      };
    });
    console.log(path, JSON.stringify(r));
  }

  console.log("\nerrors:", errors.length ? errors : "none");
  await browser.close();
})().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});

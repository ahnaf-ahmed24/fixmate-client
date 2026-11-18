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
  page.on("requestfailed", (r) => {
    if (/\.(png|jpe?g|webp|svg|gif)|unsplash/i.test(r.url()))
      console.log("  [failed]", r.failure()?.errorText, r.url());
  });

  for (const path of ["/", "/services", "/about"]) {
    console.log(`\n=== ${path} ===`);
    await page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 2500));
    const imgs = await page.$$eval("img", (els) =>
      els.map((e) => ({
        src: (e.currentSrc || e.src || "").slice(0, 90),
        w: e.naturalWidth,
        h: e.naturalHeight,
        complete: e.complete,
        display: getComputedStyle(e).display,
      }))
    );
    console.log(`img count: ${imgs.length}`);
    imgs.forEach((i) =>
      console.log(`  ${i.w}x${i.h} complete=${i.complete} display=${i.display} :: ${i.src}`)
    );
    await page.screenshot({ path: `scripts/shot-${path.replace(/\//g, "_") || "home"}.png`, fullPage: false });
  }
  await browser.close();
})().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});

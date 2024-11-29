const puppeteer = require("puppeteer");

async function scrapeData() {
  const url =
    "https://www.booking.com/searchresults.ca.html?lang=ca&src=searchresults&dest_id=734&dest_type=region&ac_position=0&ac_click_type=b&ac_langcode=ca&ac_suggestion_list_length=5&search_selected=true&search_pageview_id=4bad7986d8f60483&checkin=2025-07-05&checkout=2025-07-12&group_adults=2&no_rooms=1&group_children=0&nflt=ht_beach%3D1%3Bprivacy_type%3D3%3Bht_id%3D201%3Broomfacility%3D108";

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('[data-testid="property-card"]');

    const data = await page.evaluate(() => {
      const properties = [];
      document
        .querySelectorAll('[data-testid="property-card"]')
        .forEach((card) => {
          const title = card.querySelector(
            '[data-testid="recommended-units"] h4'
          )?.innerText;
          const location = card.querySelector(
            '[data-testid="address"]'
          )?.innerText;
          const mainImageUrl = card.querySelector("img")?.src;

          if (title && location && mainImageUrl) {
            properties.push({ title, location, mainImageUrl });
          }
        });
      return properties;
    });

    await browser.close();
    return data;
  } catch (error) {
    await browser.close();
    throw error;
  }
}

scrapeData().catch((error) => {
  console.error("Error in scrapeData:", error);
});

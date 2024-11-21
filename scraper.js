const puppeteer = require("puppeteer");
const { writeFileSync } = require("fs");

const path = require("path"); // Import the path module

// Define the output file path
const outputFilePath = path.join(__dirname, "data", "db.json");

// URL of the page to scrape
const url =
  "https://www.booking.com/searchresults.ca.html?lang=ca&src=searchresults&dest_id=734&dest_type=region&ac_position=0&ac_click_type=b&ac_langcode=ca&ac_suggestion_list_length=5&search_selected=true&search_pageview_id=4bad7986d8f60483&checkin=2025-07-05&checkout=2025-07-12&group_adults=2&no_rooms=1&group_children=0&nflt=ht_beach%3D1%3Bprivacy_type%3D3%3Bht_id%3D201%3Broomfacility%3D108";

// Function to scrape and save data
async function scrapeData() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  // await page.screenshot({ path: "debug-screenshot.png" }); // Capture a screenshot
  // const html = await page.content(); // Get page HTML
  // console.log(html); // Log the HTML
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Wait for the content to load
  await page.waitForSelector('[data-testid="property-card"]');

  const data = await page.evaluate(() => {
    const properties = [];

    document
      .querySelectorAll('[data-testid="property-card"]')
      .forEach((card) => {
        const detailLink = card.querySelector("a")
          ? card.querySelector("a").href
          : null;
        let baseUrl = "";
        if (detailLink) {
          baseUrl = detailLink.split("?")[0].replace(/\.ca\.html|\.html$/, "");
        }

        if (baseUrl) {
          // for each image should change square240 to square1200
          const imageUrl = card.querySelector("img")
            ? card.querySelector("img").src
            : null;

          const location = card.querySelector('[data-testid="address"]')
            ? card.querySelector('[data-testid="address"]').innerText
            : null;

          const title = card.querySelector(
            '[data-testid="recommended-units"] h4'
          )
            ? card.querySelector('[data-testid="recommended-units"] h4')
                .innerText
            : null;

          const details = [];
          card
            .querySelectorAll(
              '[data-testid="property-card-unit-configuration"] span'
            )
            .forEach((span) => {
              details.push(span.innerText);
            });

          let score = null;
          const reviewScoreDiv = card.querySelector(
            '[data-testid="review-score"]'
          );

          if (reviewScoreDiv) {
            const scoreText =
              reviewScoreDiv.querySelector("div > div > div")?.textContent;
            if (scoreText) {
              const match = scoreText.match(/(\d+,\d+)/);
              if (match) {
                score = match[0];
              }
            }
          }

          // Push an object with the baseUrl as the key
          properties.push({
            [baseUrl]: {
              imageUrl,
              location,
              title,
              details,
              score,
            },
          });
        }
      });

    return { properties }; // Wrap properties in a top-level object
  });

  // Overwrite the file with the new data
  writeFileSync(outputFilePath, JSON.stringify(data, null, 2));
  console.log(`Data has been saved to ${outputFilePath}`);

  await browser.close();
}

scrapeData().catch((error) => {
  console.error("Error in scrapeData:", error);
});

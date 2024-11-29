const puppeteer = require("puppeteer");

export const scrapeData = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    const url =
      "https://www.booking.com/searchresults.ca.html?label=gen173nr-1FCAQoggI49ANIBFgEaEaIAQGYAQS4AQfIAQzYAQHoAQH4AQKIAgGoAgO4AouCp7oGwAIB0gIkOTQ5ZTZjNGEtMWJiZi00NDk2LWEzYWQtMDQ1YzRiOTg1OWNl2AIF4AIB&aid=304142&ss=Cro%C3%A0cia&efdco=1&lang=en-gb&src=searchresults&dest_id=54&dest_type=country&ac_position=0&ac_click_type=b&ac_langcode=ca&ac_suggestion_list_length=5&search_selected=true&search_pageview_id=b4b95e85812b0738&checkin=2025-05-03&checkout=2025-05-05&group_adults=2&no_rooms=1&group_children=0&nflt=review_score%3D80%3Broomfacility%3D123%3Broomfacility%3D81%3Broomfacility%3D108%3Bht_beach%3D1%3Bht_id%3D1200&soz=1&lang_changed=1&explicit_lang_change=1";

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
            const url = new URL(detailLink);
            url.pathname = url.pathname.replace(/\.ca(?=\.html)/, "");
            url.searchParams.set("aid", "1649371");
            url.searchParams.set("ucfs", "1");
            baseUrl = url.toString();
          }

          if (baseUrl) {
            const companyName = "Booking.com";
            const mainImageUrl = card.querySelector("img")
              ? card.querySelector("img").src.replace(/square\d+/, "square1200")
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

            properties.push({
              baseUrl,
              companyName,
              mainImageUrl,
              location,
              title,
              details,
              score,
            });
          }
        });

      return properties;
    });

    return data;
  } catch (error) {
    console.error("Error during scraping:", error);
    throw new Error("Failed to scrape data");
  } finally {
    await browser.close();
  }
};

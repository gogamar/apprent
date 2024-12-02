const puppeteer = require("puppeteer");

export const scrapeData = async (link) => {
  if (!link || typeof link !== "string") {
    throw new Error("Invalid or missing link. A valid URL is required.");
  }
  console.log("Starting scrapeData function with link:", link);
  const browser = await puppeteer.launch({ headless: false });

  try {
    console.log("Launching browser...");
    const searchResults = await scrapeSearchResults(browser, link);
    console.log("Search results scraped:", searchResults);

    const detailedResults = await scrapePropertyDetails(browser, searchResults);
    console.log(
      "Detailed data after visiting individual pages:",
      detailedResults
    );

    return detailedResults;
  } catch (error) {
    console.error("Error during scraping:", error);
    throw new Error("Failed to scrape data");
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
};

// Function to scrape search results page
const scrapeSearchResults = async (browser, link) => {
  const page = await browser.newPage();

  try {
    console.log("Navigating to URL:", link);
    await page.goto(link, { waitUntil: "domcontentloaded" });

    console.log("Waiting for property cards...");
    await page.waitForSelector('[data-testid="property-card"]');

    console.log("Extracting property data...");

    // Extract search results
    const properties = await page.evaluate(() => {
      const results = [];

      document
        .querySelectorAll('[data-testid="property-card"]')
        .forEach((card) => {
          const detailLink = card.querySelector("a")?.href || null;
          let baseUrl = "";
          let srpvid = "";

          if (detailLink) {
            const url = new URL(detailLink);
            srpvid = url.searchParams.get("srpvid");

            // Remove ".ca" if it appears before ".html"
            if (url.pathname.includes(".ca.html")) {
              url.pathname = url.pathname.replace(".ca.html", ".html");
            }

            url.search = "";
            url.searchParams.set("aid", "1649371");
            url.searchParams.set("ucfs", "1");

            baseUrl = url.toString();
          }

          const companyName = "Booking.com";
          const mainImageUrl = card.querySelector("img")
            ? card.querySelector("img").src.replace(/square\d+/, "square1200")
            : null;

          const location =
            card.querySelector('[data-testid="address"]')?.innerText || null;
          const title =
            card.querySelector('[data-testid="recommended-units"] h4')
              ?.innerText || null;

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
              const match = scoreText.match(/(\d+\.\d+)/);
              if (match) {
                score = match[0];
              }
            }
          }

          results.push({
            baseUrl,
            srpvid,
            companyName,
            mainImageUrl,
            location,
            title,
            details,
            score,
          });
        });

      return results;
    });

    return properties;
  } catch (error) {
    console.error("Error scraping search results:", error);
    throw error;
  } finally {
    await page.close();
  }
};

// Function to scrape individual property details
const scrapePropertyDetails = async (browser, properties) => {
  const detailedProperties = [];

  for (const property of properties) {
    if (!property.baseUrl) {
      detailedProperties.push(property);
      continue;
    }

    const page = await browser.newPage();

    try {
      await page.goto(property.baseUrl, { waitUntil: "domcontentloaded" });
      await page.waitForSelector(
        '[data-testid="PropertyHeaderAddressDesktop-wrapper"]'
      );

      const details = await page.evaluate(() => {
        const addressElement = document.querySelector(
          '[data-testid="PropertyHeaderAddressDesktop-wrapper"]'
        );
        const address =
          addressElement?.querySelector(".f17adf7576")?.innerText || null;

        const mapLink = document.querySelector("[data-atlas-latlng]");
        const latLng = mapLink
          ? mapLink.getAttribute("data-atlas-latlng")
          : null;

        return {
          address,
          latitude: latLng ? latLng.split(",")[0] : null,
          longitude: latLng ? latLng.split(",")[1] : null,
        };
      });

      detailedProperties.push({
        ...property,
        address: details.address,
        latitude: details.latitude,
        longitude: details.longitude,
      });
    } catch (error) {
      console.error(`Error scraping details for ${property.baseUrl}:`, error);
      detailedProperties.push(property); // Add the property as is if details fail
    } finally {
      await page.close();
    }
  }

  return detailedProperties;
};

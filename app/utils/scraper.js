const puppeteer = require("puppeteer");

export const scrapeData = async () => {
  console.log("Starting scrapeData function...");
  const browser = await puppeteer.launch({ headless: false });

  try {
    console.log("Launching browser...");
    const searchResults = await scrapeSearchResults(browser);
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
const scrapeSearchResults = async (browser) => {
  const page = await browser.newPage();

  try {
    const url =
      "https://www.booking.com/searchresults.en-gb.html?label=gen173nr-1FCAQoggI49ANIBFgEaEaIAQGYAQS4AQfIAQzYAQHoAQH4AQKIAgGoAgO4AouCp7oGwAIB0gIkOTQ5ZTZjNGEtMWJiZi00NDk2LWEzYWQtMDQ1YzRiOTg1OWNl2AIF4AIB&aid=304142&ss=Catalonia%2C+Spain&lang=en-gb&src=searchresults&dest_id=734&dest_type=region&ac_position=0&ac_click_type=b&ac_langcode=en&ac_suggestion_list_length=5&search_selected=true&search_pageview_id=936f69cd16be01f7&checkin=2025-05-03&checkout=2025-05-05&group_adults=2&no_rooms=1&group_children=0&nflt=roomfacility%3D108%3Bht_id%3D1%3Bht_id%3D31%3Bht_beach%3D1";

    await page.goto(url, { waitUntil: "domcontentloaded" });

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

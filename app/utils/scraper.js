const puppeteer = require("puppeteer");

const setUpPage = async (page) => {
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
  );

  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
  });
};

export const scrapeData = async (link, affiliateId) => {
  if (!link || typeof link !== "string") {
    throw new Error("Invalid or missing link. A valid URL is required.");
  }

  if (!affiliateId || typeof affiliateId !== "string") {
    throw new Error(
      "Invalid or missing affiliate id. A valid affiliate id is required."
    );
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=1920,1080",
    ],
    defaultViewport: null,
  });

  try {
    const searchResults = await scrapeSearchResults(browser, link, affiliateId);
    const detailedResults = await scrapePropertyDetails(browser, searchResults);
    return detailedResults;
  } catch (error) {
    console.error("Error during scraping:", error);
    throw new Error("Failed to scrape data");
  } finally {
    await browser.close();
  }
};

const scrapeSearchResults = async (browser, link, affiliateId) => {
  const page = await browser.newPage();
  await setUpPage(page);

  try {
    await page.goto(link, { waitUntil: "networkidle2" });

    const properties = await page.evaluate((affiliateId) => {
      const results = [];
      document
        .querySelectorAll('[data-testid="property-card"]')
        .forEach((card) => {
          const detailUrl = card.querySelector("a")?.href || null;

          let siteUrl = "";
          let srpvid = "";
          if (detailUrl) {
            const url = new URL(detailUrl);
            srpvid = url.searchParams.get("srpvid");
            if (url.pathname.includes(".ca.html")) {
              url.pathname = url.pathname.replace(".ca.html", ".html");
            }
            url.search = "";
            url.searchParams.set("aid", affiliateId);
            url.searchParams.set("ucfs", "1");
            siteUrl = url.toString();
          }

          const title =
            card.querySelector('[data-testid="recommended-units"] h4')
              ?.innerText || null;
          const companyName = "Booking.com";
          const mainImageUrl = card.querySelector("img")
            ? card.querySelector("img").src.replace(/square\d+/, "square1200")
            : null;
          const location =
            card.querySelector('[data-testid="address"]')?.innerText || null;

          const locationParts = location.split(",").map((part) => part.trim());

          const town = locationParts[locationParts.length - 1];

          const details = Array.from(
            card.querySelectorAll(
              '[data-testid="property-card-unit-configuration"] span'
            )
          ).map((span) => span.innerText);

          let propertyType, bedrooms, bathrooms, kitchens, size;
          details.forEach((detail) => {
            if (detail.startsWith("Entire"))
              propertyType = detail.split("Entire ")[1];
            else if (detail.includes("bedroom")) bedrooms = parseInt(detail);
            else if (detail.includes("bathroom")) bathrooms = parseInt(detail);
            else if (detail.includes("kitchen")) kitchens = parseInt(detail);
            else if (detail.includes("m²"))
              size = detail.replace("m²", "").trim();
          });

          const scoreElement = card.querySelector(
            '[data-testid="review-score"]'
          );
          let score = null;

          if (scoreElement) {
            const scoreTextElement = scoreElement.querySelector(".ac4a7896c7");
            if (scoreTextElement) {
              score = scoreTextElement.textContent.trim().match(/[\d.]+/)?.[0];
            }
          }

          results.push({
            detailUrl,
            companyName,
            srpvid,
            siteUrl,
            mainImageUrl,
            score,
            title,
            location,
            town,
            propertyType,
            bedrooms,
            bathrooms,
            kitchens,
            size,
          });
        });

      return results;
    }, affiliateId);

    return properties;
  } finally {
    await page.close();
  }
};

const scrapePropertyDetails = async (browser, properties) => {
  const detailedProperties = [];
  const page = await browser.newPage();
  await setUpPage(page);

  for (const property of properties) {
    if (!property.detailUrl) continue;

    try {
      await page.goto(property.detailUrl, { waitUntil: "networkidle2" });

      const propDetails = await page.evaluate(() => {
        const wrapper = document.querySelector(
          'div[data-testid="PropertyHeaderAddressDesktop-wrapper"]'
        );

        const addressElement = wrapper?.querySelector(".a53cbfa6de.f17adf7576");
        const address = Array.from(addressElement?.childNodes || [])
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .map((node) => node.textContent.trim())
          .join("");
        const addressParts = address.split(",").map((part) => part.trim());

        const country = addressParts[addressParts.length - 1];

        const mapLink = wrapper?.querySelector("[data-atlas-latlng]");
        const latLng = mapLink?.getAttribute("data-atlas-latlng") || null;

        const highlightsContainer = document.querySelector(
          '[data-testid="property-highlights"]'
        );
        const highlights = Array.from(
          highlightsContainer?.querySelectorAll("li") || []
        ).map((el) => el.textContent.trim());

        const views = () => {
          const outdoorViewDiv = Array.from(
            document.querySelectorAll(".d1ca9115fe")
          ).find((div) => div.textContent.trim() === "Outdoor & View");

          if (outdoorViewDiv) {
            const parentContainer = outdoorViewDiv.closest("div.bd948ef1e2");
            if (parentContainer) {
              const listItems = parentContainer.querySelectorAll(".a8b57ad3ff");

              return Array.from(listItems)
                .map((item) => {
                  const viewElement = item.querySelector(".a5a5a75131");
                  return viewElement ? viewElement.textContent.trim() : null;
                })
                .filter(Boolean); // Filter out null values
            }
          }
          return []; // Return an empty array if not found
        };

        const viewText = () => {
          const elements = [
            document.querySelector('[data-facility-id="108"]'), // Sea View
            document.querySelector('[data-facility-id="109"]'), // Lake View
            document.querySelector('[data-facility-id="112"]'), // Mountain View
            document.querySelector('[data-facility-id="113"]'), // Landmark View
            document.querySelector('[data-facility-id="121"]'), // City View
            document.querySelector('[data-facility-id="122"]'), // River View
          ];

          return elements
            .filter((element) => element !== null)
            .map((element) => element.textContent.trim());
        };

        const outdoorViews = views();
        const facilityViews = viewText();
        const uniqueViews = Array.from(
          new Set([...outdoorViews, ...facilityViews])
        );

        return {
          address,
          country,
          latitude: latLng?.split(",")[0],
          longitude: latLng?.split(",")[1],
          highlights,
          views: uniqueViews,
        };
      });

      detailedProperties.push({ ...property, ...propDetails });
    } catch (error) {
      console.error(`Error scraping property at ${property.detailUrl}:`, error);
    }
  }

  await page.close();
  return detailedProperties;
};

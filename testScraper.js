const puppeteer = require("puppeteer");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// // Add Stealth Plugin to Puppeteer
// puppeteer.use(StealthPlugin());

const scrapePropertyDetails = async () => {
  // Launch Puppeteer with adjustments to bypass bot detection
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=1920,1080", // Set window size
    ],
    defaultViewport: null, // Use full screen
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
  );

  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
  });

  try {
    // Navigate to the target URL
    await page.goto(
      "https://www.booking.com/hotel/rs/luxury-rooms-skadarlija.en-gb.html?aid=304142&label=gen173nr-1FCAEoggI46AdIM1gEaEaIAQGYAQm4ARjIAQzYAQHoAQH4AQyIAgGoAgS4AuTxwboGwAIB0gIkYjQ5NTIyNzQtZTJlMS00ZWJjLTg5YTEtNmRmYmY2MjI4OWQ52AIG4AIB&sid=9d83d04836596e9f096dd0a048744a32&all_sr_blocks=457690307_140776076_2_2_0_466765&checkin=2025-07-08&checkout=2025-07-11&dest_id=-74897&dest_type=city&dist=0&group_adults=2&group_children=0&hapos=2&highlighted_blocks=457690307_140776076_2_2_0_466765&hpos=2&matching_block_id=457690307_140776076_2_2_0_466765&nflt=roomfacility%3D81&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&sr_order=popularity&sr_pri_blocks=457690307_140776076_2_2_0_466765_17010&srepoch=1733331855&srpvid=b3906eb61bc80145&type=total&ucfs=1&",
      { waitUntil: "networkidle2" } // Wait for network to be idle
    );

    // Interact with the DOM in the browser context
    const views = await page.evaluate(() => {
      // Step 1: Select all divs with the target class
      const outdoorViewDiv = Array.from(
        document.querySelectorAll(".d1ca9115fe")
      ).find((div) => div.textContent.trim() === "Outdoor & View");

      // Step 2: If the target div is found, locate the associated views
      if (outdoorViewDiv) {
        // Navigate to the parent containing the views
        const parentContainer = outdoorViewDiv.closest("div.bd948ef1e2");

        if (parentContainer) {
          // Select all the list items (<li>) with view descriptions
          const listItems = parentContainer.querySelectorAll(".a8b57ad3ff");

          // Extract the text content of the views
          return Array.from(listItems)
            .map((item) => {
              const viewElement = item.querySelector(".a5a5a75131"); // Target the <span> with the view text
              return viewElement ? viewElement.textContent.trim() : null;
            })
            .filter(Boolean); // Filter out null values
        }
      }
      return []; // Return an empty array if not found
    });

    const viewText = await page.evaluate(() => {
      // Define the elements to look for
      const elements = [
        document.querySelector('[data-facility-id="108"]'), // Sea View
        document.querySelector('[data-facility-id="109"]'), // Lake View
        document.querySelector('[data-facility-id="112"]'), // Mountain View
        document.querySelector('[data-facility-id="113"]'), // Landmark View
        document.querySelector('[data-facility-id="121"]'), // City View
        document.querySelector('[data-facility-id="122"]'), // River View
      ];

      // Extract text content from found elements
      return elements
        .filter((element) => element !== null) // Filter out nulls (not found)
        .map((element) => element.textContent.trim()); // Extract and trim text content
    });

    // Log or process the extracted texts
    console.log("View Texts:", viewText);

    console.log("Outdoor & View:", views);
  } catch (error) {
    console.error("Error scraping property details:", error);
  } finally {
    await browser.close();
  }
};

// Run the scraper
scrapePropertyDetails()
  .then(() => console.log("Scraping complete"))
  .catch((error) => console.error("Error:", error));

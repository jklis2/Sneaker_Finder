import puppeteer, { Page, Browser } from "puppeteer";
import { selectors } from "./selectors";

interface ScrapedData {
  name: string;
  price: number;
}

export const scrape = async (
  url: string,
  writeDataFn: (data: ScrapedData) => void
): Promise<void> => {
  const browser: Browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page: Page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
  );
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  });
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });

  try {
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.setViewport({ width: 1080, height: 1024 });

    // Scraping the title
    await page.waitForSelector(selectors.title);
    const titleElement = await page.$(selectors.title);
    if (!titleElement) {
      throw new Error(
        `Title element not found using selector: ${selectors.title}`
      );
    }
    const title: string | null = await page.evaluate(
      (el) => el.textContent?.trim(),
      titleElement
    );
    if (!title) {
      throw new Error("Title is undefined or empty");
    }

    // Scraping the price
    await page.waitForSelector(selectors.price);
    const priceElement = await page.$(selectors.price);
    if (!priceElement) {
      throw new Error(
        `Price element not found using selector: ${selectors.price}`
      );
    }
    const priceText: string | null = await page.evaluate(
      (el) => el.textContent?.trim(),
      priceElement
    );
    if (!priceText) {
      throw new Error("Price is undefined or empty");
    }

    // Clean the price string to remove non-numeric characters and convert to number
    const price: number = parseFloat(priceText.replace(/[^\d.-]/g, ""));
    if (isNaN(price)) {
      throw new Error(`Failed to parse price: ${priceText}`);
    }

    // Write the data using the provided callback function
    writeDataFn({ name: title, price });
  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    await browser.close();
  }
};

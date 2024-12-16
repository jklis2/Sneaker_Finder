import puppeteer from "puppeteer";
import { selectors } from "./selectors";
import StockX from "../models/StockX";

interface ScrapeData {
  name: string;
  price: number;
  brand: string;
  color: string;
  imageUrl: string;
  availableSizes: string[];
}

// List of brands we want to collect
const ALLOWED_BRANDS = [
  'Adidas',
  'Air Jordan',
  'Nike',
  'Yeezy',
  'BAPE',
  'Travis Scott',
  'Corteiz',
  'Carhartt WIP'
];

// Helper function to check if a brand is in our allowed list
function isAllowedBrand(brandName: string): boolean {
  return ALLOWED_BRANDS.some(allowedBrand => 
    brandName.toLowerCase().includes(allowedBrand.toLowerCase()) ||
    allowedBrand.toLowerCase().includes(brandName.toLowerCase())
  );
}

export async function saveData({ 
  name, 
  price, 
  brand,
  color,
  imageUrl, 
  availableSizes 
}: ScrapeData): Promise<void> {
  const newStockx = new StockX({
    name,
    price,
    brand,
    color,
    imageUrl,
    availableSizes,
  });
  try {
    await newStockx.save();
    console.log("Data saved to MongoDB!");
  } catch (err) {
    console.error("Error saving data to MongoDB:", err);
  }
}

type WriteDataFunction = (data: ScrapeData) => void;

export const scrape = async (
  url: string,
  writeDataFn: WriteDataFunction
): Promise<'success' | 'skipped'> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

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
    console.log(`Navigating to ${url}`);
    await page.goto(url, { 
      waitUntil: "networkidle2",
      timeout: 60000 // Increase timeout to 60 seconds
    });
    await page.setViewport({ width: 1080, height: 1024 });

    // Get title
    const titleSelectors = ["h1.product_title", ".single-product__title"];
    let title = "";
    for (const selector of titleSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        const titleElement = await page.$(selector);
        if (titleElement) {
          const text = await page.evaluate(el => el.textContent?.trim(), titleElement);
          if (text) {
            title = text;
            console.log(`Found title using selector ${selector}: ${title}`);
            break;
          }
        }
      } catch (e) {
        console.log(`Selector ${selector} not found, trying next...`);
      }
    }

    if (!title) {
      throw new Error("Could not find product title with any selector");
    }

    // Get price
    const priceSelectors = ["p.price .woocommerce-Price-amount", ".summary .woocommerce-Price-amount"];
    let priceText = "";
    for (const selector of priceSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        const priceElement = await page.$(selector);
        if (priceElement) {
          const text = await page.evaluate(el => el.textContent?.trim(), priceElement);
          if (text) {
            priceText = text;
            console.log(`Found price using selector ${selector}: ${priceText}`);
            break;
          }
        }
      } catch (e) {
        console.log(`Selector ${selector} not found, trying next...`);
      }
    }

    if (!priceText) {
      throw new Error("Could not find product price with any selector");
    }

    const price = parseFloat(priceText.replace(/[^\d.-]/g, ""));
    if (isNaN(price)) {
      throw new Error(`Failed to parse price: ${priceText}`);
    }

    // Get brand (try meta section first, then additional info table)
    let brand = "Unknown";
    try {
      // First try the meta section under product name
      await page.waitForSelector(selectors.brandMeta, { timeout: 2000 });
      const metaBrand = await page.evaluate((selector: string) => {
        const element = document.querySelector(selector);
        return element?.textContent?.trim() || null;
      }, selectors.brandMeta);

      if (metaBrand) {
        brand = metaBrand;
      } else {
        // If not found in meta, try the additional info table
        await page.waitForSelector(selectors.brand, { timeout: 2000 });
        const tableBrand = await page.evaluate((selector: string) => {
          const element = document.querySelector(selector);
          return element?.textContent?.trim() || "Unknown";
        }, selectors.brand);
        brand = tableBrand;
      }

      console.log(`Found brand: ${brand}`);
    } catch (e) {
      console.log("Could not find brand, using 'Unknown'");
    }

    // Skip this product if the brand is not in our allowed list
    if (!isAllowedBrand(brand)) {
      console.log(`Skipping product - brand "${brand}" not in allowed list`);
      return 'skipped';
    }

    // Get color
    let color = "Unknown";
    try {
      await page.waitForSelector(selectors.color, { timeout: 2000 });
      color = await page.evaluate((selector: string) => {
        const element = document.querySelector(selector);
        return element?.textContent?.trim() || "Unknown";
      }, selectors.color);
      console.log(`Found color: ${color}`);
    } catch (e) {
      console.log("Could not find color, using 'Unknown'");
    }

    // Get available sizes
    let availableSizes: string[] = [];
    try {
      await page.waitForSelector(selectors.sizes, { timeout: 2000 });
      availableSizes = await page.evaluate((selector: string) => {
        const element = document.querySelector(selector);
        if (element) {
          const text = element.textContent?.trim();
          if (text) {
            return text.split(/[,\s;\/]+/)
              .map((size: string) => size.trim())
              .filter((size: string) => size !== '' && size.toLowerCase() !== 'n/a');
          }
        }
        return [];
      }, selectors.sizes);

      if (availableSizes.length > 0) {
        console.log(`Found sizes: ${availableSizes.join(', ')}`);
      } else {
        console.log("No sizes found");
      }
    } catch (e) {
      console.log("Could not find sizes, using empty array");
    }

    // Get image URL
    let imageUrl = "";
    try {
      await page.waitForSelector(selectors.image, { timeout: 5000 });
      const imageElement = await page.$(selectors.image);
      if (imageElement) {
        imageUrl = await page.evaluate(el => {
          // Try to get the highest quality image URL
          return el.getAttribute('data-large_image') || // WooCommerce's full-size image
                 el.getAttribute('data-src') || // Lazy-loaded source
                 el.getAttribute('src') || ''; // Regular source
        }, imageElement);

        if (imageUrl) {
          // Ensure the URL is absolute
          if (imageUrl.startsWith('/')) {
            imageUrl = `https://grailpoint.com${imageUrl}`;
          } else if (!imageUrl.startsWith('http')) {
            imageUrl = `https://grailpoint.com/${imageUrl}`;
          }
          console.log(`Found image URL: ${imageUrl}`);
        }
      }
    } catch (e) {
      console.log("Could not find product image");
    }

    if (!imageUrl) {
      console.log("No image URL found, using empty string");
    }

    await writeDataFn({ 
      name: title, 
      price, 
      brand,
      color,
      imageUrl, 
      availableSizes 
    });
    return 'success';
  } catch (error) {
    throw error;
  } finally {
    await browser.close();
  }
};

export const getAllProductUrls = async (baseUrl: string): Promise<string[]> => {
  console.log(`Starting to collect all product URLs from: ${baseUrl}`);
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  const productUrls: string[] = [];
  let pageNumber = 1;

  try {
    let currentUrl = `${baseUrl}/sklep/`;
    let hasNextPage = true;

    while (hasNextPage) {
      console.log(`Scanning page ${pageNumber}: ${currentUrl}`);
      await page.goto(currentUrl, { waitUntil: "networkidle2" });
      
      // Get all product URLs on the current page
      const urls = await page.evaluate((productSelector: string) => {
        const links = document.querySelectorAll(productSelector);
        return Array.from(links).map((link) => (link as HTMLAnchorElement).href);
      }, selectors.productLinks);
      
      console.log(`Found ${urls.length} products on page ${pageNumber}`);
      productUrls.push(...urls);

      // Check if there's a next page
      const nextButton = await page.$(selectors.paginationNext);
      if (nextButton) {
        currentUrl = await page.evaluate(
          (el) => (el as HTMLAnchorElement).href,
          nextButton
        );
        pageNumber++;
      } else {
        console.log("No more pages found");
        hasNextPage = false;
      }
    }
  } catch (error) {
    console.error("Error getting product URLs:", error);
  } finally {
    await browser.close();
  }

  console.log(`Total products found from ${pageNumber} pages: ${productUrls.length}`);
  return productUrls;
};

export const scrapeAllProducts = async (
  baseUrl: string,
  writeDataFn: WriteDataFunction
): Promise<void> => {
  console.log("Starting to scrape all products from:", baseUrl);
  const productUrls = await getAllProductUrls(baseUrl);
  console.log(`Found ${productUrls.length} products to scrape`);

  let successCount = 0;
  let failureCount = 0;
  let skippedCount = 0;

  // Scrape products with a delay to avoid overwhelming the server
  for (let i = 0; i < productUrls.length; i++) {
    const url = productUrls[i];
    try {
      console.log(`Scraping product ${i + 1}/${productUrls.length}: ${url}`);
      const result = await scrape(url, writeDataFn);
      if (result === 'success') {
        successCount++;
      } else {
        skippedCount++;
      }
      console.log(`Progress: ${successCount} succeeded, ${skippedCount} skipped, ${failureCount} failed`);
      // Add a small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      failureCount++;
      console.error(`Failed to scrape ${url}:`, error);
      console.log(`Progress: ${successCount} succeeded, ${skippedCount} skipped, ${failureCount} failed`);
    }
  }
  
  console.log(`Finished scraping all products. Final results: ${successCount} succeeded, ${skippedCount} skipped, ${failureCount} failed`);
};

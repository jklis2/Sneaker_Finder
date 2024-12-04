import { Router, Request, Response } from "express";
import StockX from "../models/StockX";
import { scrape } from "../services/scrape";

const router = Router();

interface SaveData {
  name: string;
  price: number;
}

interface ScrapeRequestBody {
  url: string;
}

async function saveData({ name, price }: SaveData): Promise<void> {
  const newStockx = new StockX({
    name: name,
    price: price,
  });
  try {
    await newStockx.save();
    console.log("Data saved to MongoDB!");
  } catch (err) {
    console.error("Error saving data to MongoDB:", err);
  }
}

router.post("/scrape", (async (
  req: Request<{}, {}, ScrapeRequestBody>,
  res: Response
) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    await scrape(url, saveData);
    res.json({ message: "Scraping completed successfully" });
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).json({ error: "Failed to scrape data" });
  }
}) as any);

export default router;

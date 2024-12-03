import express from "express";
import dotenv from "dotenv";
import connectDB from "./db";
import userRoutes from "./routes/userRoutes";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Stockx from "./models/stockx.model";
import { scrape } from "./scrape";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);

const URL: string = "https://grailpoint.com/produkt/yeezy-slides-onyx";
const __dirname = dirname(fileURLToPath(import.meta.url));

interface ScrapedData {
  name: string;
  price: string;
}

function saveData({ name, price }: ScrapedData): void {
  const newStockx = new Stockx({
    name,
    price,
  });

  newStockx
    .save()
    .then(() => console.log("Data saved to MongoDB!"))
    .catch((err: Error) => console.error("Error saving data to MongoDB:", err));
}

scrape(URL, saveData);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

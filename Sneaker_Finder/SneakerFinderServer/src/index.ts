import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import cartRoutes from "./routes/cartRoutes";
import productsRoutes from "./routes/productsRoutes";
import checkoutRoutes from "./routes/checkoutRoutes";
import orderRoutes from "./routes/orderRoutes";
import { scrapeAllProducts, saveData } from "./services/scrape";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = "https://grailpoint.com";

app.use(express.json());

app.use("/api/checkout/webhook", express.raw({ type: 'application/json' }));

app.use(cors({
  origin: ['https://sneaker-finder-client-8cb4.onrender.com', 'http://localhost:5001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

connectDB();

//scrapeAllProducts(BASE_URL, saveData).catch(console.error);

app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

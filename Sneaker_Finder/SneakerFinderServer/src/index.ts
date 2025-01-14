import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import cartRoutes from "./routes/cartRoutes";
import productsRoutes from "./routes/productsRoutes";
import checkoutRoutes from "./routes/checkoutRoutes";
import orderRoutes from "./routes/orderRoutes";
import webhookRoutes from "./routes/webhookRoutes";
import adminRoutes from "./routes/adminRoutes";
import { scrapeAllProducts, saveData } from "./services/scrape";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = "https://grailpoint.com";

// Configure CORS with all necessary options
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://sneaker-finder-client-8cb4.onrender.com']
    : [
        'http://localhost:5001',
        'http://127.0.0.1:5001',
        'http://localhost:5173',
        'http://127.0.0.1:5173'
      ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
};

app.use(cors(corsOptions));

connectDB();

app.use('/api/webhook/stripe', express.raw({ type: '*/*' }));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/webhook", webhookRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

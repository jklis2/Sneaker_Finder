import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import { scrape, saveData } from "./services/scrape";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const URL = "https://grailpoint.com/produkt/yeezy-slides-onyx";

app.use(cors());
app.use(express.json());

connectDB();

scrape(URL, saveData).catch(console.error);

app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

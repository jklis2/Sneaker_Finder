import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Połączenie z bazą danych
connectDB();

// Trasy
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes); // Upewnij się, że to istnieje

// Start serwera
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import express from "express";
import dotenv from "dotenv";
import connectDB from "./db";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

connectDB();
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
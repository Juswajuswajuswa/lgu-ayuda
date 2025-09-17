import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./lib/db.js";

// routes
import authRoutes from "../api/routes/auth.route.js";

// to load env
config();

const app = express();
const PORT = process.env.PORT || 500;

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use(`/api/auth`, authRoutes);

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB:", err);
  });

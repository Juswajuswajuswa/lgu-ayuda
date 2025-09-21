import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./lib/db.js";

// routes
import authRoutes from "../api/routes/auth.route.js";
import userRoutes from "../api/routes/user.route.js";
import { handleError } from "./middleware/handleError.js";
import { sendEmail } from "./nodemailer/nodemailer.js";
import User from "./models/user.models.js";

// to load env
config();

const app = express();
const PORT = process.env.PORT || 500;

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use(handleError);

app.use(`/api/auth`, authRoutes);
app.use(`/api/user`, userRoutes);

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB:", err);
  });

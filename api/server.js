import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./lib/db.js";
import bodyParser from "body-parser";

// routes
import authRoutes from "../api/routes/auth.route.js";
import userRoutes from "../api/routes/user.route.js";
import barangayRoutes from "../api/routes/barangay.route.js";
import beneficiaryRoutes from "../api/routes/beneficiary.route.js";
import ayudaRoutes from "../api/routes/ayuda.route.js";
import applicationRoutes from "../api/routes/application.route.js";
import goodsRoutes from "../api/routes/goods.route.js";

//
import { handleError } from "./middleware/handleError.js";

// to load env
config();

const app = express();
const PORT = process.env.PORT || 500;

app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(handleError);

app.use(`/api/auth`, authRoutes);
app.use(`/api/user`, userRoutes);
app.use(`/api/barangay`, barangayRoutes);
app.use(`/api/beneficiary`, beneficiaryRoutes);
app.use(`/api/ayuda`, ayudaRoutes);
app.use(`/api/application`, applicationRoutes);
app.use(`/api/goods`, goodsRoutes);

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB:", err);
  });

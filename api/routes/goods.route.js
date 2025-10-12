import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/roles.js";
import {
  deleteGoods,
  getGoods,
  registerGoods,
  updateGoods,
} from "../controllers/goods.controller.js";

const router = express.Router();

router.post(
  `/register-goods`,
  requireAuth,
  requireRole("admin"),
  registerGoods
);

router.get(`/get-goods`, getGoods);

router.put(
  `/update-goods/:goodsId`,
  requireAuth,
  requireRole("admin"),
  updateGoods
);

router.get("/get-good/:goodsId");

router.delete(
  `/delete-goods/:goodsId`,
  requireAuth,
  requireRole("admin"),
  deleteGoods
);

export default router;

import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/roles.js";
import {
  getBudgets,
  registerBudget,
} from "../controllers/budget.controller.js";

const router = express.Router();

router.post(
  `/register-budget`,
  requireAuth,
  requireRole("admin"),
  registerBudget
);

router.get(`/get-budgets`, requireAuth, getBudgets);

export default router;

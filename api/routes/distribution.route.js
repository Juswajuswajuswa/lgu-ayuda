import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/roles.js";
import {
  deleteAllDistribution,
  distribute,
  getDistributions,
  updateDistributionStatus,
} from "../controllers/distribution.controller.js";

const router = express.Router();

router.post(
  `/distribute`,
  requireAuth,
  requireRole("distributer", "admin"),
  distribute
);

router.get(`/distributions`, getDistributions);

router.put(
  `/update-status/:distributionId`,
  requireAuth,
  requireRole("distributer", "admin"),
  updateDistributionStatus
);

router.delete(
  `/delete-distributions`,
  requireAuth,
  requireRole("admin"),
  deleteAllDistribution
);

export default router;

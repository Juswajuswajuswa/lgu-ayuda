import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/roles.js";
import {
  addBarangay,
  getBarangays,
} from "../controllers/barangay.controller.js";

const router = express.Router();

router.post(`/add-barangay`, requireAuth, requireRole("admin"), addBarangay);
router.get(`/get-barangays`, getBarangays);

export default router;

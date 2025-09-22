import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/roles.js";
import {
  addBarangay,
  deleteBarangay,
  getBarangays,
  getSingleBarangay,
  updateBarangay,
} from "../controllers/barangay.controller.js";

const router = express.Router();

router.post(`/add-barangay`, requireAuth, requireRole("admin"), addBarangay);
router.get(`/get-barangays`, getBarangays);
router.delete(
  `/delete-barangay/:barangayId`,
  requireAuth,
  requireRole("admin"),
  deleteBarangay
);
router.put(
  `/update-barangay/:barangayId`,
  requireAuth,
  requireRole("admin"),
  updateBarangay
);
router.get(`/single-barangay/:barangayId`, requireAuth, getSingleBarangay)

export default router;

import express from "express";
import {
  adminVerifyOtp,
  authenticatedUser,
  checkAdmin,
  createStaff,
  deleteStaff,
  registerAdmin,
  sendAdminEmailOTP,
  signin,
  updateStaff,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/roles.js";

const router = express.Router();

router.get(`/admin`, checkAdmin);
router.post(`/register-admin`, sendAdminEmailOTP);
router.post(`/verify-token`, adminVerifyOtp);
router.post(`/onboarding/:email`, registerAdmin);
router.post(`/create-staff`, requireAuth, requireRole("admin"), createStaff);
router.post(`/signin`, signin);
router.get(`/authenticated`, requireAuth, authenticatedUser)
router.delete(
  `/delete-staff/:staffId`,
  requireAuth,
  requireRole("admin"),
  deleteStaff
);
router.put(
  `/update-staff/:staffId`,
  requireAuth,
  requireRole("admin"),
  updateStaff
);

export default router;

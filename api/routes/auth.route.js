import express from "express";
import {
  createStaff,
  registerAdmin,
  sendAdminEmailOTP,
  signin,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/roles.js";

const router = express.Router();

router.post(`/register-admin`, sendAdminEmailOTP);
router.post(`/create-admin`, registerAdmin);
router.post(`/create-staff`, requireAuth, requireRole("admin"), createStaff);
router.post(`/signin`, signin);

export default router;

import express from "express";
import {
  createStaff,
  registerAdmin,
  signin,
} from "../controllers/auth.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(`/create-admin`, registerAdmin);
router.post(`/create-staff`, requireAuth, requireAdmin, createStaff);
router.post(`/signin`, signin);

export default router;

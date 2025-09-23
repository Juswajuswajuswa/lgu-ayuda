import express from "express";
import {
  getBeneficiaries,
  registerBeneficiary,
  scanBeneficiaryId,
  updateBeneficiary,
  verifyBeneficiaryId,
} from "../controllers/beneficiary.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/roles.js";

const router = express.Router();

router.post(
  `/register-beneficiary`,
  requireAuth,
  requireRole("encoder", "admin"),
  registerBeneficiary
);

router.get(`/:beneficiaryId/scan`, scanBeneficiaryId);
router.get(`/get-beneficiaries`, requireAuth, getBeneficiaries);
router.post(`/:beneficiaryId/scan`, verifyBeneficiaryId);
router.put(
  `/update-beneficiary/:beneficiaryId`,
  requireAuth,
  requireRole("admin", "encoder"),
  updateBeneficiary
);

export default router;

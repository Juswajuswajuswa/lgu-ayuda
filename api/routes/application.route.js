import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/roles.js";
import {
  approvedApplications,
  beneficiaryApplication,
  deleteAllApplications,
  deleteApplication,
  getApplication,
  getApplications,
  pendingApplications,
  rejectedApplications,
  updateApplicationStatus,
  //   updateApplication,
} from "../controllers/application.controller.js";

const router = express.Router();

router.post(
  `/apply-application`,
  requireAuth,
  requireRole("admin", "encoder"),
  beneficiaryApplication
);

router.get(`/get-applications`, requireAuth, getApplications);
router.get(`/get-application/:applicationId`, requireAuth, getApplication);
router.get(`/get-pendings`, pendingApplications);
router.get(`/get-approved`, approvedApplications);
router.get(`/get-rejected`, rejectedApplications);
router.post(
  `/update-status/:applicationId`,
  requireAuth,
  requireRole("validator", "admin"),
  updateApplicationStatus
);
router.delete(
  `/delete-application/:applicationId`,
  requireAuth,
  requireRole("admin", "encoder"),
  deleteApplication
);

// router.put(
//   `/update-application/:applicationId`,
//   requireAuth,
//   requireRole("admin", "encoder"),
//   updateApplication
// );

router.delete(
  `/delete-applications`,
  requireAuth,
  requireRole("admin"),
  deleteAllApplications
);

export default router;

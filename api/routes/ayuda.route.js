import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/roles.js";
import {
  deleteAyuda,
  deleteAyudas,
  getAyuda,
  getAyudas,
  registerAyuda,
  updateAyuda,
} from "../controllers/ayuda.controller.js";

const router = express.Router();

router.post(
  `/register-ayuda`,
  requireAuth,
  requireRole("admin"),
  registerAyuda
);
router.get(`/get-ayudas`, requireAuth, getAyudas);
router.get(`/get-ayuda/:ayudaId`, requireAuth, getAyuda);
router.delete(
  `/delete-ayuda/:ayudaId`,
  requireAuth,
  requireRole("admin"),
  deleteAyuda
);
router.put(
  `/update-ayuda/:ayudaId`,
  requireAuth,
  requireRole("admin"),
  updateAyuda
);
router.delete(`/delete-all-ayudas`, deleteAyudas);

export default router;

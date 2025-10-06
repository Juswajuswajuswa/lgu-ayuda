import express from "express";
import {
  getCurrentUser,
  getSingleUser,
  getStaffs,
  getUsers,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(`/get-users`, getUsers);
router.get(`/get-user/:userId`, requireAuth, getSingleUser);
router.get(`/get-staffs`, getStaffs);
router.get(`/get-currentUser`, requireAuth ,getCurrentUser);

export default router;

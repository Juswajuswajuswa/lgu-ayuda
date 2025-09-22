import express from "express";
import {
  getSingleUser,
  getStaffs,
  getUsers,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(`/get-users`, getUsers);
router.get(`/get-user/:userId`, getSingleUser);
router.get(`/get-staffs`, getStaffs);

export default router;

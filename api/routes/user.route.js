import express from "express";
import { getSingleUser, getUsers } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(`/get-users`, getUsers);
router.get(`/get-user/:userId`, getSingleUser);

export default router;

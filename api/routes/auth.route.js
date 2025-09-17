import express from "express";
import { getUsers, signUp } from "../controllers/auth.controller.js";

const router = express.Router();

router.post(`/sign-up`, signUp);
router.get(`/get-users`, getUsers);

export default router;

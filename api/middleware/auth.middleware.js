import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import { handleMakeError } from "./handleError.js";

export const requireAuth = async (req, res, next) => {
  const accessToken =
    req.cookes.accessToken || req.headers.authorization?.split(" ")[1];

  if (!accessToken)
    return next(handleMakeError(401, "You are not authorized."));

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return next(handleMakeError(401, "User not found"));
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return next(handleMakeError(401, "Only admin can access this."));
  }
};

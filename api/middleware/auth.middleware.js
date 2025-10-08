import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import { AppError } from "../utils/appError.js";

export const requireAuth = async (req, res, next) => {
  const accessToken =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!accessToken) throw new AppError(400, "You are not authorized.");

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) throw new AppError(401, "User not found");
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

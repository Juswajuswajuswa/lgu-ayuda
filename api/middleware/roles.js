import { AppError } from "../utils/appError.js";

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError(400, "Not authenticated");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        403,
        `Access denied: requires [${allowedRoles.join(", ")}]`
      );
    }
    next();
  };
};

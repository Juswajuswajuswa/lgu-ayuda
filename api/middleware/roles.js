import { handleMakeError } from "./handleError.js";

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(handleMakeError(401, "Not authenticated"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        handleMakeError(
          403,
          `Access denied: requires [${allowedRoles.join(", ")}]`
        )
      );
    }
    next();
  };
};

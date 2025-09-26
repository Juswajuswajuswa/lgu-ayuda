import { AppError } from "./appError.js";

export const validateTypes = (validTypes, type) => {
  if (!Array.isArray(validTypes)) {
    throw new AppError(400, "validTypes should be an array");
  }

  if (validTypes.length === 0) {
    throw new AppError(400, "validTypes should not be empty");
  }

  if (typeof type === "undefined" || type === null) {
    throw new AppError(400, "type is required");
  }

  if (!validTypes.includes(type)) {
    throw new AppError(
      400,
      `${type} is invalid. Valid types: ${validTypes.join(", ")}`
    );
  }

  return type;
};

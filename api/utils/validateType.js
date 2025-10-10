import { AppError } from "./appError.js";

export const validateTypes = (validTypes, type, res) => {
  if (!Array.isArray(validTypes)) {
    // throw new AppError(400, "validTypes should be an array");
    return res
      .status(400)
      .json({ success: false, message: "validTypes should be an array" });
  }

  if (validTypes.length === 0) {
    // throw new AppError(400, "validTypes should not be empty");
    return res
      .status(400)
      .json({ success: false, message: "validTypes should not be empty" });
  }

  if (typeof type === "undefined" || type === null) {
    // throw new AppError(400, "type is required");
    return res
      .status(400)
      .json({ success: false, message: "type is required" });
  }

  if (!validTypes.includes(type)) {
    // throw new AppError(
    //   400,
    //   `${type} is invalid. Valid types: ${validTypes.join(", ")}`
    // );
    return res.status(400).json({
      success: false,
      message: `${type} is invalid. Valid types: ${validTypes.join(", ")}`,
    });
  }

  return type;
};

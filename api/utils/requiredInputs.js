import { AppError } from "./appError.js";

export const requiredInputs = (requiredFields, data, next) => {
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new AppError(400, `${field} is required`);
    }
  }
};

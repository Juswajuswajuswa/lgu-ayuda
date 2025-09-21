import { handleMakeError } from "../middleware/handleError.js";

export const requiredInputs = (requiredFields, data, next) => {
  for (const field of requiredFields) {
    if (!data[field]) {
      return next(handleMakeError(400, `${field} is required`));
    }
  }
};

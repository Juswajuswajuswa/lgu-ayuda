import { AppError } from "./appError.js";

export const requiredInputs = (requiredFields, data, res) => {
  for (const field of requiredFields) {
    if (!data[field]) {
      res.status(400).json({ success: false, message: `${field} is required` });
    }
  }
};

// export const requiredInputs = (requiredFields, data, res) => {
//   for (const field of requiredFields) {
//     if (!data[field]) {
//       throw new AppError(400, `${field} is required`);
//     }
//   }
// };

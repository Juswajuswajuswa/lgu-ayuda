import Barangay from "../models/barangay.model.js";

export const validateBarangay = async (
  name,
  municipality,
  province,
  barangayId = null
) => {
  const errors = [];

  // Required field validation (only for create, not for update)
  if (!barangayId) {
    if (!name || name.trim() === "") {
      errors.push("Barangay name is required");
    }
    if (!municipality || municipality.trim() === "") {
      errors.push("Municipality is required");
    }
    if (!province || province.trim() === "") {
      errors.push("Province is required");
    }
  }

  // Length validation (only if field is provided)
  if (name && name.length > 100) {
    errors.push("Barangay name must be less than 100 characters");
  }

  if (municipality && municipality.length > 100) {
    errors.push("Municipality name must be less than 100 characters");
  }

  if (province && province.length > 100) {
    errors.push("Province name must be less than 100 characters");
  }

  // Character validation (only if field is provided)
  const nameRegex = /^[A-Za-z\s\-\.]+$/;
  if (name && !nameRegex.test(name)) {
    errors.push(
      "Barangay name can only contain letters, spaces, hyphens, and periods"
    );
  }

  if (municipality && !nameRegex.test(municipality)) {
    errors.push(
      "Municipality name can only contain letters, spaces, hyphens, and periods"
    );
  }

  if (province && !nameRegex.test(province)) {
    errors.push(
      "Province name can only contain letters, spaces, hyphens, and periods"
    );
  }

  // Check for duplicate barangay (only if all fields are provided)
  if (name && municipality && province) {
    const query = {
      name: name.trim(),
      municipality: municipality.trim(),
      province: province.trim(),
    };

    // For update operations, exclude the current barangay
    if (barangayId) {
      query._id = { $ne: barangayId };
    }

    const existingBarangay = await Barangay.findOne(query);

    if (existingBarangay) {
      errors.push(
        `Barangay '${name.trim()}' already exists in ${municipality.trim()}, ${province.trim()}`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

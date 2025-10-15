import { isValidObjectId } from "mongoose";
import Barangay from "../models/barangay.model.js";
import Beneficiary from "../models/beneficiary.model.js";

export const validateBeneficiary = async (
  fullName,
  dob,
  gender,
  phoneNumber,
  address,
  validId = null,
  beneficiaryId = null
) => {
  const errors = [];

  // Required field validation (for both create and update)
  if (!fullName || fullName.trim() === "") {
    errors.push("Full name is required");
  }

  if (!dob) {
    errors.push("Date of birth is required");
  }

  if (!gender) {
    errors.push("Gender is required");
  }

  if (!phoneNumber) {
    errors.push("Phone number is required");
  }

  // Valid ID validation (only required for create, not update)
  if (!beneficiaryId && !validId) {
    errors.push("Valid ID is required");
  }

  if (validId) {
    // Check if it's a valid base64 image
    const base64ImageRegex = /^data:image\/(jpeg|jpg|png|gif);base64,/;
    if (!base64ImageRegex.test(validId)) {
      errors.push("Valid ID must be a valid image (JPEG, PNG, or GIF)");
    } else {
      // Extract base64 data and check size
      const base64Data = validId.split(",")[1];
      if (base64Data) {
        // Calculate file size from base64 (base64 is ~33% larger than original)
        const sizeInBytes = (base64Data.length * 3) / 4;
        const sizeInMB = sizeInBytes / (1024 * 1024);

        if (sizeInMB > 10) {
          errors.push("Valid ID image must be less than 10MB");
        }
      }
    }
  }

  // Full Name validation
  if (fullName) {
    if (fullName.length < 2) {
      errors.push("Full name must be at least 2 characters long");
    }
    if (fullName.length > 100) {
      errors.push("Full name must be less than 100 characters");
    }
    const nameRegex = /^[A-Za-z\s\-\.']+$/;
    if (!nameRegex.test(fullName)) {
      errors.push(
        "Full name can only contain letters, spaces, hyphens, periods, and apostrophes"
      );
    }
  }

  // Date of Birth validation
  if (dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
      errors.push("Invalid date of birth format");
    } else {
      if (birthDate > today) {
        errors.push("Date of birth cannot be in the future");
      }

      // Check if age is reasonable
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 1) {
        errors.push("Beneficiary must be at least 1 year old");
      }
      if (age > 120) {
        errors.push("Please check the date of birth");
      }
    }
  }

  // Gender validation
  if (gender) {
    const validGenders = ["male", "female", "other"];
    if (!validGenders.includes(gender.toLowerCase())) {
      errors.push("Gender must be male, female, or other");
    }
  }

  // Phone number validation (Philippine format)
  if (phoneNumber) {
    const phoneRegex = /^(09|\+639)\d{9}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ""))) {
      errors.push(
        "Phone number must be a valid Philippine number (09XXXXXXXXX or +639XXXXXXXXX)"
      );
    } else {
      // Check for duplicate phone number (excluding current beneficiary for updates)
      const query = { phoneNumber: phoneNumber.trim() };
      if (beneficiaryId) {
        query._id = { $ne: beneficiaryId };
      }

      const existingBeneficiary = await Beneficiary.findOne(query);
      if (existingBeneficiary) {
        errors.push("Phone number is already registered");
      }
    }
  }

  // Address validation (if provided)
  if (address) {
    const { municipality, province, barangay } = address;

    if (!municipality || municipality.trim() === "") {
      errors.push("Municipality is required");
    }

    if (!province || province.trim() === "") {
      errors.push("Province is required");
    }

    if (!barangay) {
      errors.push("Barangay is required");
    } else if (!isValidObjectId(barangay)) {
      errors.push("Invalid Barangay ID format");
    } else {
      // Check if barangay exists in database
      const barangayExists = await Barangay.findById(barangay);
      if (!barangayExists) {
        errors.push("Barangay does not exist");
      }
    }

    // Municipality validation
    if (municipality && municipality.length > 100) {
      errors.push("Municipality name must be less than 100 characters");
    }

    // Province validation
    if (province && province.length > 100) {
      errors.push("Province name must be less than 100 characters");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

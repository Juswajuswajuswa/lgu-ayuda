import { isValidObjectId } from "mongoose";
import Barangay from "../models/barangay.model.js";
import User from "../models/user.models.js";

const VALID_STAFF_ROLE = ["admin", "encoder", "validator", "distributer"]; // Adjust as needed

export const validateStaff = async (
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  phoneNumber,
  role,
  barangay,
  userId = null
) => {
  const errors = [];

  // Required field validation
  if (!firstName || firstName.trim() === "") {
    errors.push("First name is required");
  }

  if (!lastName || lastName.trim() === "") {
    errors.push("Last name is required");
  }

  if (!email || email.trim() === "") {
    errors.push("Email is required");
  }

  if (!password || password.trim() === "") {
    errors.push("Password is required");
  }

  if (!confirmPassword || confirmPassword.trim() === "") {
    errors.push("Confirm password is required");
  }

  if (!phoneNumber || phoneNumber.trim() === "") {
    errors.push("Phone number is required");
  }

  if (!role) {
    errors.push("Role is required");
  }

  if (!barangay) {
    errors.push("Barangay is required");
  }

  // Name validation
  if (firstName && firstName.trim()) {
    if (firstName.length < 2) {
      errors.push("First name must be at least 2 characters long");
    }
    if (firstName.length > 50) {
      errors.push("First name must be less than 50 characters");
    }
    const nameRegex = /^[A-Za-z\s\-\.']+$/;
    if (!nameRegex.test(firstName)) {
      errors.push(
        "First name can only contain letters, spaces, hyphens, periods, and apostrophes"
      );
    }
  }

  if (lastName && lastName.trim()) {
    if (lastName.length < 2) {
      errors.push("Last name must be at least 2 characters long");
    }
    if (lastName.length > 50) {
      errors.push("Last name must be less than 50 characters");
    }
    const nameRegex = /^[A-Za-z\s\-\.']+$/;
    if (!nameRegex.test(lastName)) {
      errors.push(
        "Last name can only contain letters, spaces, hyphens, periods, and apostrophes"
      );
    }
  }

  // Email validation
  if (email && email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push("Invalid email format");
    } else {
      // Check for duplicate email
      const query = { email: email.trim().toLowerCase() };
      if (userId) {
        query._id = { $ne: userId };
      }

      const existingUser = await User.findOne(query);
      if (existingUser) {
        errors.push("Email is already registered");
      }
    }
  }

  // Password validation
  if (password && password.trim()) {
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
    if (password.length > 100) {
      errors.push("Password must be less than 100 characters");
    }

    // Check for password strength (optional)
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!strongPasswordRegex.test(password)) {
      errors.push(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
    }
  }

  // Confirm password validation
  if (password && confirmPassword && password !== confirmPassword) {
    errors.push("Passwords do not match");
  }

  // Phone number validation (Philippine format)
  if (phoneNumber && phoneNumber.trim()) {
    const phoneRegex = /^(09|\+639)\d{9}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ""))) {
      errors.push(
        "Phone number must be a valid Philippine number (09XXXXXXXXX or +639XXXXXXXXX)"
      );
    } else {
      // Check for duplicate phone number
      const query = { phoneNumber: phoneNumber.trim() };
      if (userId) {
        query._id = { $ne: userId };
      }

      const existingUser = await User.findOne(query);
      if (existingUser) {
        errors.push("Phone number is already registered");
      }
    }
  }

  // Role validation
  if (role && !VALID_STAFF_ROLE.includes(role)) {
    errors.push(`Role must be one of: ${VALID_STAFF_ROLE.join(", ")}`);
  }

  // Barangay validation
  if (barangay) {
    if (!isValidObjectId(barangay)) {
      errors.push("Invalid Barangay ID format");
    } else {
      // Check if barangay exists
      const barangayExists = await Barangay.findById(barangay);
      if (!barangayExists) {
        errors.push("Barangay does not exist");
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

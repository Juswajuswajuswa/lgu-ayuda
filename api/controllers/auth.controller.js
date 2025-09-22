import User from "../models/user.models.js";
import { generateTokens } from "../utils/generateToken.js";
import { setCookies } from "../utils/setCookies.js";
import crypto from "crypto";
import { sendEmail } from "../nodemailer/nodemailer.js";
import { requiredInputs } from "../utils/requiredInputs.js";
import Barangay from "../models/barangay.model.js";
import { AppError } from "../utils/appError.js";
import mongoose from "mongoose";

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

const otpStore = new Map();
const rateLimitStore = new Map();

// Add a cleanup function to remove expired OTPs
function cleanupExpiredOTPs() {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (data.expires < now) {
      otpStore.delete(email);
    }
  }
}

export const sendAdminEmailOTP = async (req, res, next) => {
  const { email } = req.body;

  if (!email) throw new AppError(400, "Email is required.");

  try {
    const existingEmail = await User.exists({ email });
    if (existingEmail)
      throw new AppError(400, "This email is already exist. try new one.");

    cleanupExpiredOTPs();
    // rate limiting to prevent spam request
    const lastAttempt = rateLimitStore.get(`${email}`);
    if (lastAttempt) {
      const cooldownMs = 5 * 60 * 1000; //5 minutes
      const timeSinceLastAttempt = Date.now() - lastAttempt;

      if (timeSinceLastAttempt < cooldownMs) {
        // Calculate remaining time in minutes (rounded up)
        const timeLeftMinutes = Math.ceil(
          (cooldownMs - timeSinceLastAttempt) / (1000 * 60)
        );

        throw new AppError(
          429,
          `Please wait ${timeLeftMinutes} minutes before requesting another.`
        );
      }
    }

    const otp = generateOTP();
    const expires = Date.now() + 5 * 60 * 1000;

    otpStore.set(email, {
      otp,
      expires,
    });

    rateLimitStore.set(`${email}`, Date.now());

    await sendEmail(
      email,
      "Your Login OTP",
      `Your One-Time Password (OTP) for login is: ${otp}
      This OTP will expire in 5 minutes. Please do not share it with anyone.`
    );

    res.status(200).json({
      sucess: true,
      message: "OTP sent successfully",
      data: {
        email: email,
        expires: expires,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const registerAdmin = async (req, res, next) => {
  const { email, otp } = req.body;
  requiredInputs(["email", "otp"], req.body, next);

  try {
    const stored = otpStore.get(email);

    if (!stored) throw new AppError(400, "OTP not found or expired");
    if (stored.expires < Date.now()) {
      otpStore.delete(email);
      throw new AppError(400, "OTP expired");
    }

    if (stored.otp !== otp) throw new AppError(400, "Invalid OTP");

    const createAdmin = new User({
      email,
      firstName: "John",
      lastName: "Doe",
      password: "123456",
      role: "admin",
      phoneNumber: "09123456789",
    });

    const { accessToken } = generateTokens(createAdmin._id);
    setCookies(res, accessToken);

    // Remove OTP after successful registration
    otpStore.delete(email);

    // deleting password in a response
    const savedAdmin = await createAdmin.save();
    const adminObject = savedAdmin.toObject();
    delete adminObject.password;

    res.status(200).json({
      success: true,
      message: "Admin created sucessfully!",
      data: {
        user: adminObject,
        tokens: {
          accessToken,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  requiredInputs(["email", "password"], req.body, next);

  try {
    const user = await User.findOne({ email });

    const isPasswordValid = user ? user.comparePassword(password) : false;

    if (!user || !isPasswordValid)
      throw new AppError(400, "Invalid email or password");

    const { accessToken } = generateTokens(user._id);
    setCookies(res, accessToken);

    const userObject = user.toObject();
    delete userObject.password;

    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      data: {
        user: userObject,
        tokens: {
          accessToken,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createStaff = async (req, res, next) => {
  const session = await mongoose.startSession();
  const userId = req.user.id;

  const {
    firstName,
    email,
    lastName,
    password,
    confirmPassword,
    phoneNumber,
    role,
    barangay,
  } = req.body;

  requiredInputs(
    [
      "firstName",
      "email",
      "lastName",
      "password",
      "confirmPassword",
      "phoneNumber",
      "role",
      "barangay",
    ],
    req.body,
    next
  );

  if (password.trim() != confirmPassword.trim())
    throw new AppError(400, "Passwords does not match. Please try again.");

  const validRoles = ["encoder", "validator"];
  if (!validRoles.includes(role)) throw new AppError(400, "Invalid role");

  try {
    session.startTransaction();

    const newStaff = new User({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      role,
      barangay,
    });

    const savedStaff = await newStaff.save({ session: session });

    await Barangay.findByIdAndUpdate(
      barangay,
      {
        $push: {
          staffs: newStaff._id,
        },
      },
      { new: true, runValidators: true, session: session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Succesfully created a staff",
      data: savedStaff,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const deleteStaff = async (req, res, next) => {
  const session = await mongoose.startSession();
  const { staffId } = req.params;

  if (!staffId) throw new AppError(400, "Staff ID does not exist");

  try {
    session.startTransaction();

    const user = await User.findOne({ _id: staffId }).session(session);
    if (!user) throw new AppError(400, "No user found");

    if (!user.role || user.role === "")
      throw new AppError(403, "Cannot delete a normal user");

    const deletedUser = await User.findByIdAndDelete(staffId).session(session);
    await Barangay.findByIdAndUpdate(deletedUser.barangay, {
      $pull: { staffs: staffId },
    }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Staff successfully deleted!",
      data: deletedUser,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
    console.log(error);
  }
};

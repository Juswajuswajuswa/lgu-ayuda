import User from "../models/user.models.js";
import { generateTokens } from "../utils/generateToken.js";
import { setCookies } from "../utils/setCookies.js";
import crypto from "crypto";
import { sendEmail } from "../nodemailer/nodemailer.js";
import { requiredInputs } from "../utils/requiredInputs.js";
import Barangay from "../models/barangay.model.js";
import { AppError } from "../utils/appError.js";
import mongoose from "mongoose";
import { validateTypes } from "../utils/validateType.js";

const VALID_STAFF_ROLE = ["encoder", "validator"];

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

export const checkAdmin = async (req, res, next) => {
  try {
    const isAdminExist = await User.findOne({ role: "admin" });
    if (isAdminExist) {
      return res
        .status(200)
        .json({ success: true, message: "Admin exist", data: isAdminExist });
    }

    res
      .status(201)
      .json({ success: false, message: "Admin not exist", data: isAdminExist });
  } catch (error) {
    next(error);
  }
};

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
    // if (lastAttempt) {
    //   const cooldownMs = 5 * 60 * 1000; //5 minutes
    //   const timeSinceLastAttempt = Date.now() - lastAttempt;

    //   if (timeSinceLastAttempt < cooldownMs) {
    //     // Calculate remaining time in minutes (rounded up)
    //     const timeLeftMinutes = Math.ceil(
    //       (cooldownMs - timeSinceLastAttempt) / (1000 * 60)
    //     );

    //     throw new AppError(
    //       429,
    //       `Please wait ${timeLeftMinutes} minutes before requesting another.`
    //     );
    //   }
    // }

    const otp = generateOTP();
    const expires = Date.now() + 5 * 60 * 1000;

    otpStore.set(email, {
      otp,
      expires,
    });

    rateLimitStore.set(`${email}`, Date.now());

    // const urlLink = `/verify-otp/${email}`;

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
        // link: urlLink,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const adminVerifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const stored = otpStore.get(email);

    if (!stored) throw new AppError(400, "OTP not found or expired");
    if (stored.expires < Date.now()) {
      otpStore.delete(email);
      throw new AppError(400, "OTP expired");
    }

    if (stored.otp !== otp) throw new AppError(400, "Invalid OTP");

    res.status(200).json({ success: true, message: "Correct OTP. success." });
  } catch (error) {
    next(error);
  }
};

export const registerAdmin = async (req, res, next) => {
  try {
    const { email } = req.params;
    const { firstName, lastName, password, confirmPassword, phoneNumber } =
      req.body;
    requiredInputs(["email", "password"], req.body, next);

    if (password.trim() != confirmPassword.trim())
      throw new AppError(400, "Passwords does not match. Please try again.");

    const createAdmin = new User({
      email,
      firstName,
      lastName,
      password,
      role: "admin",
      phoneNumber,
    });

    // Remove OTP after successful registration
    otpStore.delete(email);

    // deleting password in a response
    const savedAdmin = await createAdmin.save();
    const adminObject = savedAdmin.toObject();
    delete adminObject.password;

    res.status(201).json({
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

    const isValidPassword = await user.comparePassword(password);

    if (!user || !isValidPassword)
      return res
        .status(400)
        .json({ success: false, message: "Invalid username or password" });

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
    console.log(error);
  }
};

export const createStaff = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
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

  try {
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

    validateTypes(VALID_STAFF_ROLE, role);

    if (password.trim() != confirmPassword.trim())
      throw new AppError(400, "Passwords does not match. Please try again.");

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
    res.status(201).json({
      success: true,
      message: "Succesfully created a staff",
      data: savedStaff,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
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
      deleted: deletedUser,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
    console.log(error);
  }
};

export const updateStaff = async (req, res, next) => {
  const session = await mongoose.startSession();
  const { staffId } = req.params;
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

  try {
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

    validateTypes(VALID_STAFF_ROLE, role);

    session.startTransaction();

    const staff = await User.findById(staffId);
    if (!staff) throw new AppError(400, "Staff not found");

    let isPasswordChanged = false;

    if (password) {
      if (password.trim() != confirmPassword.trim())
        throw new AppError(400, "Passwords does not match. Please try again.");

      if (await staff.comparePassword(password)) {
        throw new AppError(400, "Cannot use previous password");
      } else {
        isPasswordChanged = true;
      }
    }

    const updatedData = {
      firstName,
      email,
      lastName,
      password,
      confirmPassword,
      phoneNumber,
      role,
      barangay,
    };

    const updatedUser = await User.findByIdAndUpdate(
      staffId,
      {
        $set: updatedData,
      },
      { new: true, runValidators: true }
    ).session(session);

    if (barangay && staff.barangay) {
      if (barangay.toString() !== staff.barangay.toString()) {
        await Barangay.findByIdAndUpdate(
          staff.barangay,
          {
            $pull: {
              staffs: staffId,
            },
          },
          { new: true, runValidators: true }
        ).session(session);
      }

      await Barangay.findByIdAndUpdate(
        updatedUser.barangay,
        {
          $addToSet: {
            staffs: staffId,
          },
        },
        { new: true, runValidators: true }
      ).session(session);
    }

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "Succesfully updated staff",
      data: updatedUser,
    });
  } catch (error) {
    await session.abortTransaction();

    next(error);
  } finally {
    session.endSession();
  }
};

export const authenticatedUser = async (req, res, next) => {
  const user = req.user;

  try {
    if (user) return res.status(200).json({ success: true, data: user });

    res.status(400).json({ success: false, message: "Not aunthenticated" });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  const user = req.user.id;
  try {
    const validUser = await User.findById(user);

    if (!validUser) throw new AppError(400, "No user");

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.status(200).json({ success: true, message: "Successfully logged out" });
  } catch (error) {
    next(error);
  }
};

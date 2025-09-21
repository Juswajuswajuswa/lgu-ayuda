import User from "../models/user.models.js";
import { handleMakeError } from "../middleware/handleError.js";
import { generateTokens } from "../utils/generateToken.js";
import { setCookies } from "../utils/setCookies.js";
import crypto from "crypto";
import { sendEmail } from "../nodemailer/nodemailer.js";
import { requiredInputs } from "../utils/requiredInputs.js";

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

  if (!email) return next(handleMakeError(400, "Email is required."));

  try {
    const existingEmail = await User.exists({ email });
    if (existingEmail)
      return next(
        handleMakeError(400, "This email is already exist. try new one.")
      );

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

        return next(
          handleMakeError(
            429,
            `Please wait ${timeLeftMinutes} minutes before requesting another.`
          )
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

    if (!stored) return next(handleMakeError(400, "OTP not found or expired"));

    if (stored.expires < Date.now()) {
      otpStore.delete(email);
      return next(handleMakeError(400, "OTP expired"));
    }

    if (stored.otp !== otp) return next(handleMakeError(400, "Invalid OTP"));

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
      return next(handleMakeError(400, "Invalid email or password"));

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
    return next(
      handleMakeError(400, "Passwords does not match. Please try again.")
    );

  const validRoles = ["encoder", "validator"];
  if (!validRoles.includes(role))
    return next(handleMakeError(400, "Invalid role"));

  try {
    const newStaff = new User({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      role,
      barangay,
    });

    const savedStaff = await newStaff.save();
    res.status(200).json({
      success: true,
      message: "Succesfully created a staff",
      data: savedStaff,
    });
  } catch (error) {
    next(error);
  }
};

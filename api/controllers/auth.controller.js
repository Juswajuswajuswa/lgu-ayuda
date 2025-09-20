import User from "../models/user.models.js";
import { handleMakeError } from "../middleware/handleError.js";
import { generateTokens } from "../utils/generateToken.js";
import { setCookies } from "../utils/setCookies.js";

export const registerAdmin = async (req, res, next) => {
  const { email } = req.body;

  try {
    const existingEmail = await User.exists({ email });
    if (existingEmail)
      return next(
        handleMakeError(400, "This email is already exist. try new one.")
      );

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

  if (!email || !password)
    return next(handleMakeError(400, "Email and password are required"));

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
  const { firstName, lastName, password, confirmPassword, phoneNumber, role } =
    req.body;

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
      password,
      phoneNumber,
      role,
    });

    const savedStaff = newStaff.save();
    res.status(200).json({
      success: true,
      message: "Succesfully created a staff",
      staff: savedStaff,
    });
  } catch (error) {
    next(error);
  }
};

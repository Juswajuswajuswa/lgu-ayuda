import User from "../models/user.models.js";
import { handleMakeError } from "../middleware/handleError.js";

export const signUp = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingEmail = await User.findOne({ email: email });

    if (existingEmail)
      return handleMakeError(400, "An account with this email already exists");

    const newUser = new User({
      email,
      password,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      newUser,
    });
  } catch (error) {
    console.log(error);
  }
};

export const createAdmin = async (req, res, next) => {};

export const getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find();
    if (!allUsers) return res.json({ message: "no users yet", allUsers: [] });

    console.log(allUsers);

    res.status(200).json({ success: true, users: allUsers });
  } catch (error) {}
};

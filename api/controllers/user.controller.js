import { populate } from "dotenv";
import User from "../models/user.models.js";
import { AppError } from "../utils/appError.js";

export const getSingleUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) throw new AppError(400, "This user does not exist");
    res.status(200).json({ success: true, user: user });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find().sort({ createdAt: -1 });
    if (!allUsers) return res.json({ message: "no users yet", allUsers: [] });

    console.log(allUsers);

    res.status(200).json({ success: true, users: allUsers });
  } catch (error) {
    next(error);
  }
};

export const getStaffs = async (req, res, next) => {
  try {
    const allStaffs = await User.find({
      $or: [{ role: "encoder" }, { role: "validator" }],
    })
      .populate({ path: "barangay", select: "name municipality province" })
      .sort({ createdAt: -1 });
    if (!allStaffs)
      return res.json({ message: "no staffs yet", allStaffs: [] });

    res.status(200).json({ success: true, users: allStaffs });
  } catch (error) {
    next(error);
  }
};

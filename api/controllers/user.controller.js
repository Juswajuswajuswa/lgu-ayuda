import User from "../models/user.models.js";

export const getSingleUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return next(handleMakeError(400, "This user does not exist"));
    res.status(200).json({ success: true, user: user });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find();
    if (!allUsers) return res.json({ message: "no users yet", allUsers: [] });

    console.log(allUsers);

    res.status(200).json({ success: true, users: allUsers });
  } catch (error) {}
};

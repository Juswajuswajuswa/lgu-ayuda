import User from "../models/user.models.js";

export const signUp = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const newUser = new User({
      username,
      password,
    });

    await newUser.save();

    res.status(200).json({
      newUser,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find();
    if (!allUsers) return res.json({ message: "no users yet", allUsers: [] });

    console.log(allUsers);

    res.status(200).json({ users: allUsers });
  } catch (error) {}
};

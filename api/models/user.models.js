import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserModelSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  username: {
    type: String,
    required: [true, "Password is required"],
    unique: true,
  },
  password: {
    type: String,
    requred: [true, "Password is required"],
  },
});

UserModelSchema.pre("save", async function (next) {
  if (!this.isDirectModified("password")) next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserModelSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserModelSchema);
export default User;

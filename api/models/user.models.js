import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const UserModelSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    phoneNumber: { type: String, required: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      requred: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["admin", "validator", "encoder", "distributer"], // what more???
    },

    barangay: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barangay",
    },

    
  },
  { timestamps: true }
);

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

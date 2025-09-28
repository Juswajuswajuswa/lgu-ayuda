import mongoose from "mongoose";

const ApplicationModelSchema = new mongoose.Schema(
  {
    beneficiary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Beneficiary",
      required: true,
    },
    ayuda: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ayuda",
      required: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "approved", "rejected"],
      default: "pending",
    },
    notes: String,
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", ApplicationModelSchema);
export default Application;

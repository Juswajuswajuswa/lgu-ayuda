import mongoose from "mongoose";

const ProgramModelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    amount: { type: Number },
    type: { type: String, enum: ["cash", "goods"], default: "cash" },
    eligibilityRules: { type: Object },
    budget: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Program = mongoose.model("Program", ProgramModelSchema);
export default Program;

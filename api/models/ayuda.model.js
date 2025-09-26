import mongoose from "mongoose";

const AyudaModelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    amount: { type: Number },
    type: { type: String, enum: ["cash", "goods"], default: "cash" },
    // eligibilityRules: { type: Object },
    budget: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Ayuda = mongoose.model("Ayuda", AyudaModelSchema);
export default Ayuda;

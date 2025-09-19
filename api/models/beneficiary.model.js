import mongoose from "mongoose";

const BeneficiaryModelSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"] },
    phoneNumber: { type: String, required: true },
    address: {
      street: String,
      barangay: String,
      city: String,
    },
    // houseHoldSize: {}, ??
    income: { type: String, enum: ["low", "middle", "high"], default: "low" },
    status: {
      type: String,
      enum: ["registered", "approved", "rejected"],
      default: "registered",
    },

    qrCode: {
      type: String,
    },

    barangay: { type: mongoose.Schema.Types.ObjectId, ref: "Barangay" },
  },
  { timestamps: true }
);

const Beneficiary = mongoose.model("Beneficiary", BeneficiaryModelSchema);
export default Beneficiary;

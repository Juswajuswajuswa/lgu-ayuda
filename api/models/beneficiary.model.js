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
      street: { type: String, required: true },
      city: { type: String, required: true },
      barangay: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Barangay",
        required: true,
      },
    },
    // houseHoldSize: {}, ??
    // income: { type: String, enum: ["low", "middle", "high"], default: "low" },
    status: {
      type: String,
      enum: ["registered", "approved", "rejected"],
      default: "registered",
    },

    validId: [
      {
        type: String,
        required: true,
      },
    ],

    claimCode: {
      type: String,
    },

    // qrCode: {D
    //   type: String,
    // },

    // isScanned: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  { timestamps: true }
);

const Beneficiary = mongoose.model("Beneficiary", BeneficiaryModelSchema);
export default Beneficiary;

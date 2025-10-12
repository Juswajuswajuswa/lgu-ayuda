import mongoose from "mongoose";

const BarangayModelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    municipality: { type: String, required: true },
    province: { type: String, required: true },

    beneficiaries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Beneficiary",
      },
    ],

    staffs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Barangay = mongoose.model("Barangay", BarangayModelSchema);
export default Barangay;

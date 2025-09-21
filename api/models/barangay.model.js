import mongoose from "mongoose";

const BarangayModelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    municipality: { type: String, required: true },
    province: { type: String, required: true },
    // captainsName: String,
    // contactNumber: String,
    staff: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Baranggay = mongoose.model("Barangay", BarangayModelSchema);
export default Baranggay;

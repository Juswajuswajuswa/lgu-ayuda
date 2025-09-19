import mongoose from "mongoose";

const BaranggayModelSchema = new mongoose.Schema(
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
  { timestamps }
);

const Baranggay = mongoose.model("Baranggay", BaranggayModelSchema);
export default Baranggay;

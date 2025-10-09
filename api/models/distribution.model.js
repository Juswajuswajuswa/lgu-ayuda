import mongoose from "mongoose";

const DistributionModelSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
    unique: true,
  },
  ayudaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ayuda",
    required: true,
  },
  // goods: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Goods",
  //   },
  // ],
  releasedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receivedBy: {
    type: String,
  },
  distributionType: {
    type: String,
    enum: ["cash", "goods"],
  },
  dateReleased: {
    type: String,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "claimed", "unclaimed"],
    default: "pending",
  },
});

const Distribution = mongoose.model("Distribution", DistributionModelSchema);

export default Distribution;

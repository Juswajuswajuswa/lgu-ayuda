import mongoose from "mongoose";

const GoodsModelSchema = new mongoose.Schema(
  {
    product: {
      name: { type: String, required: true },
      details: { type: String, required: true },
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timeTamps: true }
);

const Goods = mongoose.model("Goods", GoodsModelSchema);
export default Goods;

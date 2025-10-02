import mongoose from "mongoose";

const GoodsModelSchema = new mongoose.Schema(
  {
   product: {
    
   },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timeTamps: true }
);

const Goods = mongoose.model("Goods", GoodsModelSchema);
export default Goods;

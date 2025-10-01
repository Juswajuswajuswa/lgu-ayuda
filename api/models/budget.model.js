import mongoose from "mongoose";

const BudgetModelSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: ["national", "lgu", "private"],
      required: true,
    },

    description: {
      type: String,
    },

    totalAmount: {
      type: Number,
    },

    type: {
      type: String,
      enum: ["cash", "goods"],
      default: "cash",
    },

    items: [
      {
        name: String,
        unit: String,
        quantity: Number,
      },
    ],

    balance: {
      type: Number,
    },

    allocated: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Budget = mongoose.model("Budget", BudgetModelSchema);

export default Budget;

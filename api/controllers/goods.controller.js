import Goods from "../models/goods.model.js";
import { AppError } from "../utils/appError.js";
import { requiredInputs } from "../utils/requiredInputs.js";

export const registerGoods = async (req, res, next) => {
  try {
    const { product, quantity } = req.body;
    requiredInputs(["product", "quantity"], req.body);

    if (!product || typeof product !== "object") {
      throw new AppError(400, "Product object is required");
    }
    const { name, details } = product;
    if (!name) throw new AppError(400, "name is required");
    if (!details) throw new AppError(400, "details is required");

    // Validate quantity
    if (quantity === undefined || quantity === null) {
      throw new AppError(400, "quantity is required");
    }
    if (typeof quantity !== "number" || isNaN(quantity)) {
      throw new AppError(400, "quantity must be a number");
    }

    const newGoods = new Goods({
      product: { name, details },
      quantity,
    });

    const savedGoods = await newGoods.save();
    res.status(201).json({
      success: true,
      message: "Successfully added a goods",
      data: savedGoods,
    });
  } catch (error) {
    next(error);
  }
};

export const getGoods = async (req, res, next) => {
  try {
    const goods = await Goods.find().sort({ createdAt: -1 });
    if (!goods && goods.length === 0) {
      return res.json({ message: "Empty goods", goods: [] });
    }
    res
      .status(200)
      .json({ success: true, message: "goods found", data: goods });
  } catch (error) {
    next(error);
  }
};

export const deleteGoods = async (req, res, next) => {
  try {
    const { goodsId } = req.params;

    const goods = await Goods.findById(goodsId);
    if (!goods) throw new AppError(400, "Invalid or not found goods ID");
    const deletedGoods = await Goods.findByIdAndDelete(goodsId);
    res.status(200).json({
      sucess: true,
      message: "Successfully deleted goods",
      deleted: deletedGoods,
    });
  } catch (error) {
    next(error);
  }
};

export const updateGoods = async (req, res, next) => {
  try {
    const { goodsId } = req.params;
    const { product, quantity } = req.body;

    requiredInputs(["product", "quantity"], req.body);

    if (!product || typeof product !== "object") {
      throw new AppError(400, "Product object is required");
    }
    const { name, details } = product;
    if (!name) throw new AppError(400, "name is required");
    if (!details) throw new AppError(400, "details is required");

    // Validate quantity
    if (quantity === undefined || quantity === null) {
      throw new AppError(400, "quantity is required");
    }
    if (typeof quantity !== "number" || isNaN(quantity)) {
      throw new AppError(400, "quantity must be a number");
    }

    const updatedGoods = await Goods.findByIdAndUpdate(
      goodsId,
      {
        product: { name, details },
        quantity,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated goods",
      data: updatedGoods,
    });
  } catch (error) {
    next(error);
  }
};

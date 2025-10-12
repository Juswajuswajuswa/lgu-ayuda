import Goods from "../models/goods.model.js";
import { AppError } from "../utils/appError.js";
import { requiredInputs } from "../utils/requiredInputs.js";
import { validateGoods } from "../validations/goods.validation.js";

export const registerGoods = async (req, res, next) => {
  try {
    const { product, quantity } = req.body;

    // Use validation function
    const validation = await validateGoods(product, quantity);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    const { name, details } = product;

    const newGoods = new Goods({
      product: {
        name: name.trim(),
        details: details.trim(),
      },
      quantity,
    });

    const savedGoods = await newGoods.save();

    res.status(201).json({
      success: true,
      message: "Successfully added goods",
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

    // Use validation function with goodsId for duplicate check
    const validation = await validateGoods(product, quantity, goodsId);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    // Check if goods exists
    const existingGoods = await Goods.findById(goodsId);
    if (!existingGoods) {
      return res.status(404).json({
        success: false,
        message: "Goods not found",
      });
    }

    const { name, details } = product;

    const updatedGoods = await Goods.findByIdAndUpdate(
      goodsId,
      {
        product: {
          name: name.trim(),
          details: details.trim(),
        },
        quantity,
      },
      { new: true, runValidators: true }
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

export const getGood = async (req, res, next) => {
  try {
    const { goodsId } = req.params;

    const goods = await Goods.findById(goodsId);

    if (!goods)
      return res.status(400).json({ success: false, message: "invalid id" });

    res
      .status(200)
      .json({ success: true, message: "Successfully fetched", goods });
  } catch (error) {
    next(error);
  }
};

import mongoose from "mongoose";
import { validateTypes } from "../utils/validateType.js";
import { requiredInputs } from "../utils/requiredInputs.js";
import Budget from "../models/budget.model.js";
import { AppError } from "../utils/appError.js";

const BUDGET_SOURCES = ["national", "lgu", "private"];
const BUDGET_TYPES = ["cash", "goods"];

export const registerBudget = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { source, description, totalAmount, type, items } = req.body;

  try {
    requiredInputs(["source", "description", "totalAmount", "type"], req.body);

    validateTypes(BUDGET_SOURCES, source);
    validateTypes(BUDGET_TYPES, type);

    if (type === "goods" && (!items || Array.isArray(items))) {
      throw new AppError(400, "Items should be an array.");
    }

    const budgetData = {
      source,
      description,
      type,
      balance: 0,
      ...(type === "cash" ? { totalAmount } : {}),
      ...(type === "goods" ? { items } : {}),
    };

    if (type === "cash" && totalAmount) {
      budgetData.balance += totalAmount;
    } else if (type === "goods" && items) {
      budgetData.totalAmount = items.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      budgetData.balance = budgetData.totalAmount;
    }

    const budget = new Budget(budgetData);

    const savedBudget = await budget.save({ session });

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "Successfully added a budget",
      data: savedBudget,
    });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find();
    if (!budgets && budgets.length === 0)
      return res.json({ message: "Empty budgets", budgets: [] });
    res.status(200).json({ sucess: true, data: budgets });
  } catch (error) {
    next(error);
  }             
};

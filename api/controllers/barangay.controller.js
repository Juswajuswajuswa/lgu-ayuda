import mongoose from "mongoose";
import Baranggay from "../models/barangay.model.js";
import { requiredInputs } from "../utils/requiredInputs.js";
import { AppError } from "../utils/appError.js";
import User from "../models/user.models.js";
import Barangay from "../models/barangay.model.js";
import Beneficiary from "../models/beneficiary.model.js";

export const addBarangay = async (req, res, next) => {
  const { name, municipality, province } = req.body;
  requiredInputs(["name", "municipality", "province"], req.body, next);

  try {
    const newBarangay = new Baranggay({
      name,
      municipality,
      province,
    });

    const savedBarangay = await newBarangay.save();
    res.status(201).json({
      success: true,
      message: "Succesfully added a barangay",
      data: savedBarangay,
    });
  } catch (error) {
    next(error);
  }
};

export const getBarangays = async (req, res, next) => {
  try {
    const barangays = await Baranggay.find()
      .populate({
        path: "staffs",
        select: "firstName lastName email phoneNumber role createdAt",
        options: { sort: { createdAt: -1 } },
      })
      .sort({ createdAt: -1 });
    if (!barangays && barangays.length === 0) {
      return res.json({ message: "Empty barangay", barangays: [] });
    }

    console.log(barangays);
    res.status(200).json({ success: true, barangays: barangays });
  } catch (error) {
    next(error);
  }
};

export const deleteBarangay = async (req, res, next) => {
  const session = await mongoose.startSession();
  const { barangayId } = req.params;

  try {
    session.startTransaction();
    const barangay = await Baranggay.findById(barangayId);
    if (!barangay) throw new AppError(400, "No barangay found!");

    const deletedBarangay = await Baranggay.findByIdAndDelete(
      barangayId
    ).session(session);

    await User.updateMany(
      {
        barangay: deletedBarangay.staffs,
      },
      { $unset: { barangay: null } },
      { new: true }
    ).session(session);

    await Beneficiary.updateMany(
      {
        "address.barangay": deletedBarangay._id,
      },
      { $set: { "address.barangay": null } },
      { new: true }
    ).session(session);

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      success: true,
      message: "Successfully deleted a barangay",
      deleted: deletedBarangay,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const updateBarangay = async (req, res, next) => {
  const { barangayId } = req.params;
  const { name, municipality, province } = req.body;
  requiredInputs(["name", "municipality", "province"], req.body, next);

  try {
    const barangay = await Barangay.findById(barangayId);
    if (!barangay) throw new AppError(400, "No barangay found");

    const barangayData = {
      name,
      municipality,
      province,
    };

    const updatedBarangay = await Barangay.findByIdAndUpdate(
      barangayId,
      barangayData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated a barangay",
      data: updatedBarangay,
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleBarangay = async (req, res, next) => {
  const { barangayId } = req.params;
  try {
    const barangay = await Barangay.findById(barangayId);
    if (!barangay) throw new AppError(400, "No Barangay ID found");

    res.status(200).json({ success: true, data: barangay });
  } catch (error) {
    next(error);
  }
};

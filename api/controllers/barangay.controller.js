import Baranggay from "../models/barangay.model.js";
import { requiredInputs } from "../utils/requiredInputs.js";

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
    res.status(200).json({
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
      return res
        .status(200)
        .json({ message: "No barangay found", barangays: [] });
    }

    console.log(barangays);
    res.status(200).json({ success: true, barangays: barangays });
  } catch (error) {
    next(error);
  }
};

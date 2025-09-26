import Ayuda from "../models/ayuda.model.js";
import { AppError } from "../utils/appError.js";
import { requiredInputs } from "../utils/requiredInputs.js";
import { validateTypes } from "../utils/validateType.js";

export const registerAyuda = async (req, res, next) => {
  const { name, description, amount, type, budget } = req.body;

  if (type === "cash") {
    if (!amount || amount <= 0)
      throw new AppError(400, "Amount is required for cash type");
  }

  requiredInputs(["name", "description", "type", "budget"], req.body);
  validateTypes(["cash", "goods"], type);

  try {
    const ayuda = new Ayuda({
      name,
      description,
      amount: type === "cash" ? amount : undefined,
      type,
      budget,
    });

    const savedAyuda = await ayuda.save();

    res.status(201).json({
      success: true,
      message: "Successfully registered a ayuda",
      data: savedAyuda,
    });
  } catch (error) {
    next(error);
  }
};

export const getAyudas = async (req, res, next) => {
  try {
    const ayudas = await Ayuda.find().sort({ createdAt: -1 });
    if (!ayudas && ayudas.length === 0)
      res.json({ message: "Empty ayuda", ayudas: [] });
    res.status(200).json({ success: true, data: ayudas });
  } catch (error) {
    next(error);
  }
};

export const getAyuda = async (req, res, next) => {
  const { ayudaId } = req.params;
  try {
    const ayuda = await Ayuda.findById(ayudaId);
    if (!ayuda) throw new AppError(400, "Invalid or no found ayuda ID");
    res.status(200).json({ success: true, data: ayuda });
  } catch (error) {
    next(error);
  }
};

export const deleteAyuda = async (req, res, next) => {
  const { ayudaId } = req.params;
  try {
    const ayuda = await Ayuda.findById(ayudaId);
    if (!ayuda) throw new AppError(400, "Invalid or No found ayuda ID");

    const deletedAyuda = await Ayuda.findByIdAndDelete(ayudaId);
    res.status(200).json({
      success: true,
      message: "Successfully deleted a ayuda",
      deleted: deletedAyuda,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAyuda = async (req, res, next) => {
  const { ayudaId } = req.params;
  const { name, description, amount, type, budget } = req.body;

  if (type === "cash") {
    if (!amount || amount <= 0) {
      throw new AppError(400, "Amount is required for cash type");
    }
  }

  requiredInputs(["name", "description", "type", "budget"], req.body);
  validateTypes(["cash", "goods"], type);

  try {
    const ayuda = await Ayuda.findById(ayudaId);
    if (!ayuda) throw new AppError(400, "Invalid or no found ayuda ID");

    const updatedAyuda = await Ayuda.findByIdAndUpdate(
      ayudaId,
      {
        name,
        description,
        amount: type === "cash" ? amount : undefined,
        type,
        budget,
      },
      { new: true }
    );

    res.status(200).json({
      succses: true,
      message: "Successfully updated a ayuda",
      data: updatedAyuda,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAyudas = async (req, res, next) => {
  try {
    const ayudas = await Ayuda.find();
    if (!ayudas.length === 0) throw new AppError(400, "No ayudas to delete");

    const deletedAyudas = await Ayuda.deleteMany();
    res.status(200).json({
      success: true,
      message: "deleted all ayudas successfully",
      data: deletedAyudas,
    });
  } catch (error) {
    next(error);
  }
};

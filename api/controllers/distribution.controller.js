import mongoose from "mongoose";
import { requiredInputs } from "../utils/requiredInputs.js";
import { validateTypes } from "../utils/validateType.js";
import Distribution from "../models/distribution.model.js";
import Application from "../models/application.model.js";
import Ayuda from "../models/ayuda.model.js";
import Beneficiary from "../models/beneficiary.model.js";

const VALID_DISTRIBUTE_STATUS = ["pending", "claimed", "unclaimed"];

export const distribute = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const userId = req.user.id;
  const { applicationId, ayudaId, status } = req.body;
  try {
    requiredInputs(["applicationId", "ayudaId", "status"], req.body);
    validateTypes(VALID_DISTRIBUTE_STATUS, status);

    const isApplicationExist = await Distribution.findOne({ applicationId });
    if (isApplicationExist)
      return res.status(400).json({
        success: false,
        message: "This applicant is already in the distribution table",
      });

    const application = await Application.findById(applicationId);
    const ayuda = await Ayuda.findById(ayudaId);
    if (!application)
      return res
        .status(400)
        .json({ success: true, message: "Invalid applicationId" });

    if (!ayuda)
      return res.status(400).json({ sucess: true, message: "Invalid ayudaid" });

    const distribution = new Distribution({
      applicationId,
      ayudaId,
      releasedBy: userId,
      receivedBy: application.beneficiary,
      distributionType: ayuda.type,
      status,
    });

    const savedDistribution = await distribution.save();

    await Beneficiary.findByIdAndUpdate(application.beneficiary, {
      $set: {
        status: "claimed",
      },
    });

    await session.commitTransaction();
    res.status(201).json({
      success: true,
      message: "Successfully distributed",
      data: savedDistribution,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const getDistributions = async (req, res, next) => {
  try {
    const distributions = await Distribution.find()
      .populate([
        {
          path: "applicationId",
          populate: [
            {
              path: "beneficiary",
              select: "fullName phoneNumber address",
              populate: {
                path: "address.barangay",
                select: "name municipality province",
              },
            },
            {
              path: "ayuda",
              select: "name type amount",
            },
          ],
        },
        {
          path: "ayudaId",
          select: "name type amount",
        },
        {
          path: "releasedBy",
          select: "firstName lastName",
        },
      ])
      .sort({ createdAt: -1 });

    if (!distributions || distributions.length === 0)
      return res.json({ success: true, message: "An empty distribution" });

    res.status(200).json({
      success: true,
      message: "Distributions found",
      data: distributions,
    });
  } catch (error) {
    next(error);
  }
};

export const getClaimedDistributions = async (req, res, next) => {
  try {
    const distributions = await Distribution.find({ status: "claimed" })
      .populate([
        {
          path: "applicationId",
          populate: [
            {
              path: "beneficiary",
              select: "fullName phoneNumber address",
              populate: {
                path: "address.barangay",
                select: "name municipality province",
              },
            },
            {
              path: "ayuda",
              select: "name type amount",
            },
          ],
        },
        {
          path: "ayudaId",
          select: "name type amount",
        },
        {
          path: "releasedBy",
          select: "firstName lastName",
        },
      ])
      .sort({ createdAt: -1 });

    if (!distributions || distributions.length === 0)
      return res.json({
        success: true,
        message: "An empty claimed distribution",
      });
    res.status(200).json({
      success: true,
      message: "Distributions found",
      data: distributions,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDistributionStatus = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { distributionId } = req.params;
    const { status } = req.body;

    validateTypes(VALID_DISTRIBUTE_STATUS, status);

    const distribution = await Distribution.findById(distributionId).session(
      session
    );
    if (!distribution)
      return res
        .status(400)
        .json({ success: false, message: "Invalid distribution ID" });

    // Update distribution status
    distribution.status = status;
    await distribution.save({ session });

    // If marked as claimed, update beneficiary status
    if (status === "claimed") {
      const application = await Application.findById(
        distribution.applicationId
      ).session(session);
      if (application) {
        await Beneficiary.findByIdAndUpdate(
          application.beneficiary,
          { $set: { status: "claimed" } },
          { session }
        );
      }
    }

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "Distribution status updated successfully",
      data: distribution,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const deleteAllDistribution = async (req, res, next) => {
  try {
    const distribution = await Distribution.find();
    if (distribution.length === 0)
      return res.json({
        success: false,
        message: "No distributions to delete",
      });

    const deleteDistributions = await Distribution.deleteMany();

    res.status(200).json({
      success: true,
      message: "deleted all distributions successfully",
      data: deleteDistributions,
    });
  } catch (error) {
    next(error);
  }
};

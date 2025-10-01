import mongoose from "mongoose";
import Application from "../models/application.model.js";
import { AppError } from "../utils/appError.js";
import { validateTypes } from "../utils/validateType.js";
import Beneficiary from "../models/beneficiary.model.js";

const VALID_APPLICATION_STATUS = [
  "pending",
  "verified",
  "approved",
  "rejected",
];

export const beneficiaryApplication = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { beneficiary, ayuda, status, notes } = req.body;
    const userId = req.user.id;

    if (!userId) throw new AppError(400, "Invalid user ID");
    if (!beneficiary) throw new AppError(400, "Beneficiary is required");
    if (!ayuda) throw new AppError(400, "Ayuda is required");

    validateTypes(VALID_APPLICATION_STATUS, status);

    const application = new Application({
      beneficiary,
      ayuda,
      status,
      submittedBy: userId,
      notes,
    });

    const savedApplication = await application.save({ session });

    await Beneficiary.findByIdAndUpdate(
      beneficiary,
      {
        $set: {
          isApplied: true,
        },
      },
      { new: true }
    ).session();

    const populatedApplication = await savedApplication.populate([
      {
        path: "beneficiary",
        select: "fullName dob gender phoneNumber address isApplied",
        populate: {
          path: "address.barangay",
          select: "name municipality province",
        },
      },
      {
        path: "ayuda",
        select: "name",
      },
    ]);

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Successfully sent an application",
      data: populatedApplication,
    });
  } catch (error) {
    await session.abortTransaction();

    next(error);
  } finally {
    session.endSession();
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate([
        {
          path: "beneficiary",
          select: "fullName dob gender phoneNumber address isApplied",
          populate: {
            path: "address.barangay",
            select: "name municipality province",
          },
        },
        {
          path: "ayuda",
          select: "name",
        },
      ])
      .sort({ createdAt: -1 });
    if (!applications && applications.length === 0)
      return res.json({
        succes: true,
        message: "Empty applications",
        applications: [],
      });

    res.status(200).json({ succes: true, data: applications });
  } catch (error) {
    next(error);
  }
};

export const getApplication = async (req, res, next) => {
  const { applicationId } = req.params;

  try {
    const application = await Application.findById(applicationId).populate([
      {
        path: "beneficiary",
        select: "fullName dob gender phoneNumber address isApplied",
        populate: {
          path: "address.barangay",
          select: "name municipality province",
        },
      },
      {
        path: "ayuda",
        select: "name",
      },
    ]);

    if (!application)
      throw new AppError(400, "Invalid or no found application ID");

    res
      .status(200)
      .json({ sucess: true, message: "Application found", data: application });
  } catch (error) {
    next(error);
  }
};

export const deleteAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find();
    if (applications.length === 0)
      return res.json({
        success: true,
        message: "No applications to be deleted",
        applications: [],
      });

    const deletedApplications = await Application.deleteMany();
    res.status(200).json({
      succes: true,
      message: "Successfully deleted all applications",
      deleted: deletedApplications,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { applicationId } = req.params;
  //   FOR LOG
  const userId = req.user.id;

  try {
    const application = await Application.findById(applicationId).session();
    if (!application)
      throw new AppError(400, "Invalid or no found application ID");

    const beneficiaryInApplication = application.beneficiary;

    if (beneficiaryInApplication)
      throw new AppError(400, "No beneficiary in application found");

    const deletedApplication = await Application.findByIdAndDelete(
      applicationId
    ).session();

    // LOG
    //

    await Beneficiary.findByIdAndUpdate(
      beneficiaryInApplication,
      {
        $set: {
          isApplied: false,
        },
      },
      { new: true }
    ).session();

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "Successfully deleted an application",
      deleted: deletedApplication,
      deletedBy: userId,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// export const updateApplication = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   const { applicationId } = req.params;
//   const { beneficiary, ayuda, status, notes } = req.body;
//   const userId = req.user.id;

//   if (!userId) throw new AppError(400, "Invalid user ID");
//   if (!beneficiary) throw new AppError(400, "Beneficiary is required");
//   if (!ayuda) throw new AppError(400, "Ayuda is required");

//   validateTypes(VALID_APPLICATION_STATUS, status);

//   try {
//     const application = await Application.findById(applicationId);
//     if (!application)
//       throw new AppError(400, "No found or invalid application ID");

//     const updatedApplication = await Application.findByIdAndUpdate(
//       applicationId,
//       {
//         beneficiary,
//         ayuda,
//         status,
//         notes,
//         status,
//       },
//       {
//         new: true,
//       }
//     );

//     await session.commitTransaction();
//     session.endSession();
//     res.status(200).json({
//       success: true,
//       message: "Successfully updated an application",
//       data: {
//         updatedApplication,
//         editedBy: userId,
//       },
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     next(error);
//   }
// };

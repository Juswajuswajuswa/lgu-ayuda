import mongoose, { isValidObjectId, set } from "mongoose";
import Beneficiary from "../models/beneficiary.model.js";
import { AppError } from "../utils/appError.js";
import { requiredInputs } from "../utils/requiredInputs.js";
import Barangay from "../models/barangay.model.js";
import { validateBeneficiary } from "../validations/beneficiary.validation.js";

export const registerBeneficiary = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { fullName, dob, gender, phoneNumber, address } = req.body;

  try {
    // Use validation function instead of requiredInputs
    const validation = await validateBeneficiary(
      fullName,
      dob,
      gender,
      phoneNumber,
      address
    );

    if (!validation.isValid) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    let beneficiaryAddress;
    if (address) {
      const { street, barangay, city } = address;
      if (!street || !barangay || !city) {
        throw new AppError(400, "Please input required fields under address");
      }

      if (!isValidObjectId(barangay))
        throw new AppError(400, "Invalid Barangay ID");

      beneficiaryAddress = { street, city, barangay };
    }

    const beneficiary = new Beneficiary({
      fullName,
      dob,
      gender,
      phoneNumber,
      address: beneficiaryAddress,
    });

    // const scanUrl = `http://192.168.100.145:5000/api/beneficiary/${beneficiary._id}/scan`;
    // const qrCodeBuffer = await QRCode.toBuffer(scanUrl, {
    //   width: 300,
    //   margin: 2,
    // });
    // const qrCodeBase64 = qrCodeBuffer.toString("base64");

    // beneficiary.qrCode = qrCodeBase64;

    const savedBeneficiary = await beneficiary.save({ session });

    savedBeneficiary.claimCode = beneficiary._id;

    if (beneficiaryAddress?.barangay) {
      await Barangay.findByIdAndUpdate(
        beneficiaryAddress.barangay,
        {
          $push: {
            beneficiaries: beneficiary._id,
          },
        },
        { new: true }
      ).session(session);
    }

    await session.commitTransaction();
    res.status(201).json({
      success: true,
      message: "Successfully registered a user",
      data: {
        claimCode: beneficiary._id,
        beneficiary: beneficiary,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// export const scanBeneficiaryId = async (req, res, next) => {
//   const { beneficiaryId } = req.params;

//   try {
//     const beneficiary = await Beneficiary.findById(beneficiaryId);
//     if (!beneficiary) throw new AppError(400, "Beneficiary not found");

//     if (beneficiary.isScanned)
//       return res.send("<h1>This QR code was already scanned ✅</h1>");

//     res.send(`
//       <html>
//         <head><title>QR Scan Verification</title></head>
//         <body style="font-family: Arial; padding: 20px;">
//           <h1>Verify ${beneficiary.fullName}</h1>
//           <form method="POST" action="/api/beneficiary/${beneficiaryId}/scan">
//             <label for="id">Enter ID to confirm:</label><br/>
//             <input type="text" name="id" id="id" required />
//             <br/><br/>
//             <button type="submit">Verify</button>
//           </form>
//         </body>
//       </html>
//     `);
//   } catch (error) {
//     next(error);
//   }
// };

// export const verifyBeneficiaryId = async (req, res, next) => {
//   const { beneficiaryId } = req.params;
//   const { id } = req.body;

//   try {
//     const beneficiary = await Beneficiary.findById(beneficiaryId);
//     if (!beneficiary)
//       return res.status(404).send("<h1>Beneficiary not found</h1>");

//     if (beneficiary.isScanned) {
//       return res.send("<h1>Already scanned ❌</h1>");
//     }

//     if (id !== beneficiary._id.toString()) {
//       return res.send("<h1>Invalid ID ❌</h1>");
//     }

//     beneficiary.isScanned = true;
//     await beneficiary.save();

//     res.send("<h1>QR Code Verified ✅</h1>");
//   } catch (error) {
//     next(error);
//   }
// };

export const getBeneficiaries = async (req, res, next) => {
  try {
    const beneficiaries = await Beneficiary.find()
      .populate({
        path: "address.barangay",
        select: "name municipality province",
      })
      .sort({ createdAt: -1 });
    if (beneficiaries && beneficiaries.length === 0)
      return res.status(200).json({
        success: true,
        message: "No beneficiary yet",
        beneficiaries: [],
      });

    res.status(200).json({ sucess: true, data: beneficiaries });
  } catch (error) {
    next(error);
  }
};

export const updateBeneficiary = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { beneficiaryId } = req.params;
  const { fullName, dob, gender, phoneNumber, address } = req.body;

  try {
    // Use validation function instead of requiredInputs
    const validation = await validateBeneficiary(
      fullName,
      dob,
      gender,
      phoneNumber,
      address,
      beneficiaryId
    );

    if (!validation.isValid) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    // Check if beneficiary exists
    const beneficiary = await Beneficiary.findById(beneficiaryId);
    if (!beneficiary) {
      throw new AppError(404, "Beneficiary not found");
    }

    let beneficiaryAddress;
    let oldBarangayId = beneficiary.address?.barangay;

    if (address) {
      const { street, barangay, city } = address;

      // Verify barangay exists (already checked in validation, but double-check for safety)
      const barangayExists = await Barangay.findById(barangay).session(session);
      if (!barangayExists) {
        throw new AppError(400, "Barangay does not exist");
      }

      beneficiaryAddress = {
        street: street.trim(),
        city: city.trim(),
        barangay,
      };

      // Remove beneficiary from old barangay if barangay changed
      if (oldBarangayId && barangay !== oldBarangayId.toString()) {
        await Barangay.findByIdAndUpdate(
          oldBarangayId,
          {
            $pull: {
              beneficiaries: beneficiaryId,
            },
          },
          { session }
        );
      }
    }

    const updatedBeneficiary = await Beneficiary.findByIdAndUpdate(
      beneficiaryId,
      {
        fullName: fullName.trim(),
        dob,
        gender: gender.toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        address: beneficiaryAddress,
      },
      { new: true, session } // Added session here
    );

    // Add beneficiary to new barangay (only if barangay changed or new address)
    if (beneficiaryAddress?.barangay) {
      await Barangay.findByIdAndUpdate(
        beneficiaryAddress.barangay,
        {
          $addToSet: {
            beneficiaries: updatedBeneficiary._id,
          },
        },
        { session } // Added session here
      );
    }

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "Successfully updated beneficiary",
      data: updatedBeneficiary,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

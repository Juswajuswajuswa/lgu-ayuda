import mongoose, { isValidObjectId, set } from "mongoose";
import Beneficiary from "../models/beneficiary.model.js";
import { AppError } from "../utils/appError.js";
import { requiredInputs } from "../utils/requiredInputs.js";
import QRCode from "qrcode";
import Barangay from "../models/barangay.model.js";
import crypto from "crypto";

export const registerBeneficiary = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { fullName, dob, gender, phoneNumber, address } = req.body;
  requiredInputs(["fullName", "dob", "gender", "phoneNumber"], req.body);

  try {
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
      status: "registered",
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
    session.endSession();
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
    session.endSession();
    next(error);
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
  requiredInputs(["fullName", "dob", "gender", "phoneNumber"], req.body);

  try {
    const beneficiary = await Beneficiary.findById(beneficiaryId);
    if (!beneficiary) throw new AppError(400, "Beneficiary not found");

    let beneficiaryAddress;

    if (address) {
      const { street, barangay, city } = address;
      if (!street || !barangay || !city) {
        throw new AppError(400, "Please input required fields under address");
      }

      if (!isValidObjectId(barangay))
        throw new AppError(400, "Invalid Barangay ID");

      if (barangay) {
        if (barangay !== beneficiary.address.barangay) {
          await Barangay.findByIdAndUpdate(
            beneficiary.address.barangay,
            {
              $pull: {
                beneficiaries: beneficiaryId,
              },
            },
            { new: true }
          ).session(session);
        }
      }

      beneficiaryAddress = { street, city, barangay };
    }

    const updatedBeneficiary = await Beneficiary.findByIdAndUpdate(
      beneficiaryId,
      {
        fullName,
        dob,
        gender,
        phoneNumber,
        status: "registered",
        address: beneficiaryAddress,
      },
      { new: true }
    );

    if (beneficiaryAddress?.barangay) {
      await Barangay.findByIdAndUpdate(
        beneficiaryAddress.barangay,
        {
          $addToSet: {
            beneficiaries: updatedBeneficiary._id,
          },
        },
        { new: true }
      ).session(session);
    }

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      success: true,
      message: "Successfully updated beneficiary",
      data: updatedBeneficiary,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

import OrganizerModel from "@models/organizer.model";
import VerificationModel from "@models/verification.model";

import { getDate } from "@helpers/date";
import { generateOTP } from "@helpers/generator";

import ApiError from "@utils/ApiError";

const createAccountVerification = async (id: string) => {
  const [dbOrganizer, dbVerification] = await Promise.all([
    OrganizerModel.findById(id, {
      verified: 1,
    }).lean({
      versionKey: false,
    }),
    VerificationModel.exists({
      user: id,
      type: "auth",
    }),
  ]);

  if (!dbOrganizer) {
    throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
  }

  if (dbOrganizer.verified) {
    throw new ApiError("User Has Already Been Verified", "BAD_REQUEST");
  }

  const otp = generateOTP();

  const expiry = getDate(10);

  if (dbVerification) {
    await VerificationModel.updateOne(
      {
        _id: dbVerification._id,
      },
      {
        $set: {
          otp,
          expiredAt: expiry,
        },
      },
      {
        runValidators: true,
      },
    );

    return {
      success: true,
    };
  }

  const newVerification = new VerificationModel({
    user: id,
    type: "auth",
    otp,
    expiredAt: expiry,
  });

  await newVerification.save();

  return {
    success: true,
  };
};

export default createAccountVerification;

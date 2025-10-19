import OrganizerModel from "@models/organizer.model";

import { UpdateOrganizerValidatorSchema } from "@validators/organizer/updateOrganizer.validator";

import MongooseError, { isMongooseError } from "@utils/MongooseError";

import ApiError from "@utils/ApiError";

const updateOrganizer = async (
  id: string,
  data: UpdateOrganizerValidatorSchema
) => {
  try {
    const dbOrganizer = await OrganizerModel.findOne(
      {
        _id: id,
      },
      {
        mobile: 1,
        verified: 1,
      }
    ).lean({
      versionKey: false,
    });

    if (!dbOrganizer) {
      throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
    }

    if (!dbOrganizer.verified) {
      throw new ApiError(
        "Unable To Proceed Since Account Has Not Been Verified",
        "ACCOUNT_LOCKED"
      );
    }

    if (data.mobile && data.mobile !== dbOrganizer.mobile) {
      const dbOrganizerWithMobile = await OrganizerModel.exists({
        mobile: data.mobile,
      });

      if (dbOrganizerWithMobile) {
        throw new ApiError(
          "User With Given Mobile Number Already Exists",
          "BAD_REQUEST"
        );
      }
    }

    const { acknowledged, modifiedCount } = await OrganizerModel.updateOne(
      {
        _id: dbOrganizer._id,
      },
      data
    );

    if (!acknowledged || modifiedCount !== 1) {
      throw new ApiError(
        "Unable To Update User Due To Server",
        "INTERNAL_SERVER_ERROR"
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Update User Due To Server",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export default updateOrganizer;

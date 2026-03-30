import UserModel from "@models/user.model";

import { clearCachedUser } from "./helpers/redis";

import { UpdateUserValidatorSchema } from "@validators/user/updateUser.validator";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const updateUser = async (id: string, data: UpdateUserValidatorSchema) => {
  try {
    const dbUser = await UserModel.findOne(
      {
        _id: id,
      },
      {
        mobile: 1,
        verified: 1,
      },
    ).lean({
      versionKey: false,
    });

    if (!dbUser) {
      throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
    }

    if (!dbUser.verified) {
      throw new ApiError(
        "Unable To Proceed Since Account Has Not Been Verified",
        "ACCOUNT_LOCKED",
      );
    }

    if (data.mobile && data.mobile !== dbUser.mobile) {
      const dbUserWithMobile = await UserModel.exists({
        mobile: data.mobile,
      });

      if (dbUserWithMobile) {
        throw new ApiError(
          "User With Given Mobile Number Already Exists",
          "BAD_REQUEST",
        );
      }
    }

    const { acknowledged, modifiedCount } = await UserModel.updateOne(
      {
        _id: dbUser._id,
      },
      data,
    );

    if (!acknowledged || modifiedCount !== 1) {
      throw new ApiError(
        "Unable To Update User Due To Server",
        "INTERNAL_SERVER_ERROR",
      );
    }

    await clearCachedUser(dbUser._id.toString());

    return {
      success: true,
    };
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Update User Due To Server",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

export default updateUser;

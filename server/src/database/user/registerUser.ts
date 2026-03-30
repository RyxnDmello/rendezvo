import UserModel from "@models/user.model";

import { RegisterUserValidatorSchema } from "@validators/user/registerUser.validator";

import { hashPassword } from "@helpers/encryption";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const registerUser = async (data: RegisterUserValidatorSchema) => {
  try {
    const [dbUserWithEmail, dbUserWithMobile] = await Promise.all([
      await UserModel.exists({
        email: data.email,
      }),
      await UserModel.exists({
        mobile: data.mobile,
      }),
    ]);

    if (dbUserWithEmail) {
      throw new ApiError(
        "User With Given Email Address Already Exists",
        "BAD_REQUEST",
      );
    }

    if (dbUserWithMobile) {
      throw new ApiError(
        "User With Given Mobile Number Already Exists",
        "BAD_REQUEST",
      );
    }

    const encrypted = await hashPassword(data.password);

    const newUser = new UserModel({
      ...data,
      password: encrypted,
    });

    await newUser.save();

    return {
      id: newUser.id,
      verified: newUser.verified,
    };
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Create Account Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

export default registerUser;

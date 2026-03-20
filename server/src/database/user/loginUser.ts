import UserModel from "@models/user.model";

import { LoginUserValidatorSchema } from "@validators/user/loginUser.validator";

import { verifyPassword } from "@helpers/password";

import { createTokens } from "./helpers/token";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const loginUser = async (data: LoginUserValidatorSchema) => {
  try {
    const dbUser = await UserModel.findOne(
      {
        email: data.email,
      },
      {
        name: 1,
        email: 1,
        mobile: 1,
        password: 1,
        verified: 1,
      },
    ).lean({
      versionKey: false,
    });

    if (!dbUser) {
      throw new ApiError(
        "User With Given Email Address Does Not Exist",
        "BAD_REQUEST",
      );
    }

    if (!dbUser.password) {
      throw new ApiError(
        "Please Try A Different Method To Login",
        "BAD_REQUEST",
      );
    }

    const valid = await verifyPassword(data.password, dbUser.password);

    if (!valid) {
      throw new ApiError("Invalid Password", "INVALID_CREDENTIALS");
    }

    if (!dbUser.verified) {
      return {
        id: dbUser._id,
        verified: dbUser.verified,
      };
    }

    const { accessToken, refreshToken } = await createTokens(
      dbUser._id.toString(),
    );

    return {
      id: dbUser._id,
      name: dbUser.name,
      email: dbUser.email,
      mobile: dbUser.mobile,
      verified: dbUser.verified,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Login Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

export default loginUser;

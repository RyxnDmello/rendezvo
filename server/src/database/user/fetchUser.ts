import UserModel, { User } from "@models/user.model";

import { getCachedUser, setCachedUser } from "./helpers/redis";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const fetchUser = async (id: string) => {
  try {
    return ((await getCachedUser(id)) ?? (await getUser(id))) as User;
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Retrieve User Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

const getUser = async (id: string) => {
  const dbUser = await UserModel.findById(id, {
    password: 0,
    createdAt: 0,
    updatedAt: 0,
  }).lean({
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

  const { _id, ...data } = dbUser;

  const user = {
    id,
    ...data,
  };

  await setCachedUser(id, user);

  return user;
};

export default fetchUser;

import UserModel, { User } from "@models/user.model";

import { getCachedUser, setCachedUser } from "./helpers/redis";

import ApiError from "@utils/ApiError";

/**
 * A service function that retrieves a user.
 *
 * The data is stored in cache, for a period of time, after the first call.
 * Every subsequent request returns the cached data.
 *
 * @param {string} id - The ID of the user.
 *
 * @returns The user data.
 */
const fetchUser = async (id: string) => {
  const user = (await getCachedUser(id)) ?? (await getUser(id));
  return user as User;
};

/**
 * A service helper function that retrieves a user from the database.
 *
 * This function fetches the user, validates its existence and verification status,
 * transforms the response, and stores it in cache.
 *
 * @param {string} id - The ID of the user.
 *
 * @returns The user data.
 *
 * @throws
 * - An ApiError if user does not exist.
 * - An ApiError if user is not verified.
 */
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

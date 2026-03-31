import UserModel, { User } from "@models/user.model";

import { getCachedUser, setCachedUser } from "./helpers/redis";

import ApiError from "@utils/ApiError";

const fetchUser = async (id: string) => {
  const user = (await getCachedUser(id)) ?? (await getUser(id));
  return user as User;
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

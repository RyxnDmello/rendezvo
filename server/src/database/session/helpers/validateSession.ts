import SessionModel from "@models/session.model";

import { RefreshTokenPayload as UserRefreshTokenPayload } from "@database/user/helpers/token";
import { RefreshTokenPayload as OrganizerRefreshTokenPayload } from "@database/organizer/helpers/token";

import { hashToken } from "@helpers/encryption";

import ApiError from "@utils/ApiError";

const validateSession = async (
  token: string,
  payload: OrganizerRefreshTokenPayload | UserRefreshTokenPayload,
) => {
  const { data, jti, iss } = payload;

  const { id, ip, di, role } = data;

  const dbSession = await SessionModel.findOne(
    {
      user: id,
      ip,
      di,
      jti,
      iss,
      role,
    },
    {
      token: 1,
    },
  ).lean({
    versionKey: false,
  });

  if (!dbSession) {
    await SessionModel.deleteMany({
      user: id,
    });

    throw new ApiError(
      "Your Authorization Has Been Invalidated",
      "REFRESH_TOKEN_INVALID",
    );
  }

  const hashed = await hashToken(token);

  if (hashed !== dbSession.token) {
    throw new ApiError(
      "Your Authorization Has Been Invalidated",
      "REFRESH_TOKEN_INVALID",
    );
  }
};

export default validateSession;

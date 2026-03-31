import { Context } from "hono";
import { getConnInfo } from "hono/bun";

import fetchUser from "@services/user/fetchUser";
import loginUser from "@services/user/loginUser";
import updateUser from "@services/user/updateUser";
import registerUser from "@services/user/registerUser";

import { LoginUserContext } from "@validators/user/loginUser.validator";
import { UpdateUserContext } from "@validators/user/updateUser.validator";
import { RegisterUserContext } from "@validators/user/registerUser.validator";

import { setSessionCookie } from "@services/user/helpers/cookie";

import ApiError from "@utils/ApiError";

export const _fetchUser = async (ctx: Context) => {
  const user = ctx.get("user");

  const organizer = await fetchUser(user.id);
  return ctx.json(organizer, 200);
};

export const _loginUser = async (ctx: LoginUserContext) => {
  const ip = getConnInfo(ctx).remote.address;

  const data = ctx.req.valid("json");

  if (!ip) {
    throw new ApiError("User IP Address Must Be Provided", "BAD_REQUEST");
  }

  const { refreshToken, ...organizer } = await loginUser(ip, data);

  if (refreshToken) {
    await setSessionCookie(ctx, refreshToken);
  }

  return ctx.json(organizer, 200);
};

export const _registerUser = async (ctx: RegisterUserContext) => {
  const data = ctx.req.valid("json");

  const organizer = await registerUser(data);
  return ctx.json(organizer, 200);
};

export const _updateUser = async (ctx: UpdateUserContext) => {
  const user = ctx.get("user");

  const data = ctx.req.valid("json");

  if (!user.id) {
    throw new ApiError("User ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await updateUser(user.id, data);
  return ctx.json(result, 200);
};

export const _removeUser = (ctx: Context) => {
  return ctx.json({});
};

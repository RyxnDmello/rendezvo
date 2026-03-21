import { Context } from "hono";

import fetchUser from "@database/user/fetchUser";
import loginUser from "@database/user/loginUser";
import updateUser from "@database/user/updateUser";
import registerUser from "@database/user/registerUser";

import { LoginUserContext } from "@validators/user/loginUser.validator";
import { UpdateUserContext } from "@validators/user/updateUser.validator";
import { RegisterUserContext } from "@validators/user/registerUser.validator";

import { setSessionCookie } from "@database/user/helpers/cookie";

import { ApiErrorCustomResponse, ApiErrorResponse } from "@utils/ApiError";

export const _fetchUser = async (ctx: Context) => {
  const user = ctx.get("user");

  try {
    const organizer = await fetchUser(user.id);
    return ctx.json(organizer, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _loginUser = async (ctx: LoginUserContext) => {
  const data = ctx.req.valid("json");

  try {
    const { refreshToken, ...organizer } = await loginUser(data);

    if (refreshToken) {
      await setSessionCookie(ctx, refreshToken);
    }

    return ctx.json(organizer, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _registerUser = async (ctx: RegisterUserContext) => {
  const data = ctx.req.valid("json");

  try {
    const organizer = await registerUser(data);
    return ctx.json(organizer, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _updateUser = async (ctx: UpdateUserContext) => {
  const user = ctx.get("user");

  const data = ctx.req.valid("json");

  try {
    if (!user.id) {
      return ApiErrorCustomResponse(ctx, {
        error: "User ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await updateUser(user.id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _removeUser = (ctx: Context) => {
  return ctx.json({});
};

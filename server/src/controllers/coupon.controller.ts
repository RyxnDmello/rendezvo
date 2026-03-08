import { Context } from "hono";

import fetchCoupon from "@database/coupon/fetchCoupon";
import fetchCoupons from "@database/coupon/fetchCoupons";

import addCoupon from "@database/coupon/addCoupon";
import updateCoupon from "@database/coupon/updateCoupon";
import toggleCoupon from "@database/coupon/toggleCoupon";
import deleteCoupon from "@database/coupon/deleteCoupon";

import { AddCouponContext } from "@validators/coupon/addCoupon.validator";
import { UpdateCouponContext } from "@validators/coupon/updateCoupon.validator";

import { ApiErrorResponse, ApiErrorCustomResponse } from "@utils/ApiError";

export const _fetchCoupon = async (ctx: Context) => {
  const user = ctx.get("user");

  const eventID = ctx.req.param("id");

  const couponID = ctx.req.param("couponID");

  try {
    if (!eventID) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    if (!couponID) {
      return ApiErrorCustomResponse(ctx, {
        error: "Coupon ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const coupon = await fetchCoupon(couponID, eventID, user.id);
    return ctx.json(coupon, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _fetchCoupons = async (ctx: Context) => {
  const user = ctx.get("user");

  const eventID = ctx.req.param("id");

  try {
    if (!eventID) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const coupon = await fetchCoupons(eventID, user.id);
    return ctx.json(coupon, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _addCoupon = async (ctx: AddCouponContext) => {
  const user = ctx.get("user");

  const eventID = ctx.req.param("id");

  const data = ctx.req.valid("json");

  try {
    if (!eventID) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await addCoupon(eventID, user.id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _updateCoupon = async (ctx: UpdateCouponContext) => {
  const user = ctx.get("user");

  const eventID = ctx.req.param("id");

  const couponID = ctx.req.param("couponID");

  const data = ctx.req.valid("json");

  try {
    if (!eventID) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    if (!couponID) {
      return ApiErrorCustomResponse(ctx, {
        error: "Coupon ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await updateCoupon(couponID, eventID, user.id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _toggleCoupon = async (ctx: Context) => {
  const user = ctx.get("user");

  const eventID = ctx.req.param("id");

  const couponID = ctx.req.param("couponID");

  try {
    if (!eventID) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    if (!couponID) {
      return ApiErrorCustomResponse(ctx, {
        error: "Coupon ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await toggleCoupon(couponID, eventID, user.id);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _deleteCoupon = async (ctx: Context) => {
  const user = ctx.get("user");

  const eventID = ctx.req.param("id");

  const couponID = ctx.req.param("couponID");

  try {
    if (!eventID) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    if (!couponID) {
      return ApiErrorCustomResponse(ctx, {
        error: "Coupon ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await deleteCoupon(couponID, eventID, user.id);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

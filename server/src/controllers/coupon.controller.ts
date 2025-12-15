import fetchCoupon from "@database/coupon/fetchCoupon";
import fetchCoupons from "@database/coupon/fetchCoupons";

import addCoupon from "@database/coupon/addCoupon";
import updateCoupon from "@database/coupon/updateCoupon";
import toggleCoupon from "@database/coupon/toggleCoupon";
import deleteCoupon from "@database/coupon/deleteCoupon";

import { FetchCouponContext } from "@validators/coupon/fetchCoupon.validator";
import { FetchCouponsContext } from "@validators/coupon/fetchCoupons.validator";

import { AddCouponContext } from "@validators/coupon/addCoupon.validator";
import { UpdateCouponContext } from "@validators/coupon/updateCoupon.validator";
import { ToggleCouponContext } from "@validators/coupon/toggleCoupon.validator";
import { DeleteCouponContext } from "@validators/coupon/deleteCoupon.validator";

import { ApiErrorResponse, ApiErrorCustomResponse } from "@utils/ApiError";

export const _fetchCoupon = async (ctx: FetchCouponContext) => {
  const id = ctx.req.param("id");

  const couponID = ctx.req.param("couponID");

  const query = ctx.req.valid("query");

  try {
    if (!id) {
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

    const coupon = await fetchCoupon(id, couponID, query);
    return ctx.json(coupon, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _fetchCoupons = async (ctx: FetchCouponsContext) => {
  const id = ctx.req.param("id");

  const query = ctx.req.valid("query");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const coupon = await fetchCoupons(id, query);
    return ctx.json(coupon, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _addCoupon = async (ctx: AddCouponContext) => {
  const id = ctx.req.param("id");

  const data = ctx.req.valid("json");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await addCoupon(id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _updateCoupon = async (ctx: UpdateCouponContext) => {
  const id = ctx.req.param("id");

  const couponID = ctx.req.param("couponID");

  const data = ctx.req.valid("json");

  try {
    if (!id) {
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

    const result = await updateCoupon(id, couponID, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _toggleCoupon = async (ctx: ToggleCouponContext) => {
  const id = ctx.req.param("id");

  const couponID = ctx.req.param("couponID");

  const data = ctx.req.valid("query");

  try {
    if (!id) {
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

    const result = await toggleCoupon(id, couponID, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _deleteCoupon = async (ctx: DeleteCouponContext) => {
  const id = ctx.req.param("id");

  const couponID = ctx.req.param("couponID");

  const data = ctx.req.valid("query");

  try {
    if (!id) {
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

    const result = await deleteCoupon(id, couponID, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

import { Context } from "hono";

import fetchCoupon from "@services/coupon/fetchCoupon";
import fetchCoupons from "@services/coupon/fetchCoupons";

import addCoupon from "@services/coupon/addCoupon";
import updateCoupon from "@services/coupon/updateCoupon";
import toggleCoupon from "@services/coupon/toggleCoupon";
import deleteCoupon from "@services/coupon/deleteCoupon";

import { AddCouponContext } from "@validators/coupon/addCoupon.validator";
import { UpdateCouponContext } from "@validators/coupon/updateCoupon.validator";

import ApiError from "@utils/ApiError";

/**
 * A controller function that fetches a coupon of an event.
 *
 * @param {Context} ctx - A hono context.
 *
 * @returns A response of the retrieved coupon.
 *
 * @throws
 * - An ApiError if event ID is not provided.
 * - An ApiError if coupon ID is not provided.
 */
export const _fetchCoupon = async (ctx: Context) => {
  const user = ctx.get("user");

  const eventID = ctx.req.param("id");
  const couponID = ctx.req.param("couponID");

  if (!eventID) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  if (!couponID) {
    throw new ApiError("Coupon ID Must Be Provided", "BAD_REQUEST");
  }

  const coupon = await fetchCoupon(couponID, eventID, user.id);
  return ctx.json(coupon, 200);
};

/**
 * A controller function that fetches all the coupons of an event.
 *
 * @param {Context} ctx - A hono context.
 *
 * @returns A response of all the retrieved coupons.
 *
 * @throws An ApiError if event ID is not provided.
 */
export const _fetchCoupons = async (ctx: Context) => {
  const user = ctx.get("user");

  const eventID = ctx.req.param("id");

  if (!eventID) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  const coupon = await fetchCoupons(eventID, user.id);
  return ctx.json(coupon, 200);
};

/**
 * A controller function that adds a new coupon to an event.
 *
 * @param {AddCouponContext} ctx - A hono context with AddCouponContext type support.
 *
 * @returns A success response if the coupon is added.
 *
 * @throws An ApiError if event ID is not provided.
 */
export const _addCoupon = async (ctx: AddCouponContext) => {
  const user = ctx.get("user");

  const eventID = ctx.req.param("id");

  const data = ctx.req.valid("json");

  if (!eventID) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await addCoupon(eventID, user.id, data);
  return ctx.json(result, 200);
};

/**
 * A controller function that updates a coupon of an event.
 *
 * @param {UpdateCouponContext} ctx - A hono context with UpdateCouponContext type support.
 *
 * @returns A success response if the coupon is updated.
 *
 * @throws
 * - An ApiError if event ID is not provided.
 * - An ApiError if coupon ID is not provided.
 */
export const _updateCoupon = async (ctx: UpdateCouponContext) => {
  const user = ctx.get("user");

  const eventID = ctx.req.param("id");
  const couponID = ctx.req.param("couponID");

  const data = ctx.req.valid("json");

  if (!eventID) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  if (!couponID) {
    throw new ApiError("Coupon ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await updateCoupon(couponID, eventID, user.id, data);
  return ctx.json(result, 200);
};

/**
 * A controller function that toggles a coupon of an event.
 *
 * @param {Context} ctx - A hono context.
 *
 * @returns A success response if the coupon is toggled.
 *
 * @throws
 * - An ApiError if event ID is not provided.
 * - An ApiError if coupon ID is not provided.
 */
export const _toggleCoupon = async (ctx: Context) => {
  const user = ctx.get("user");

  const eventID = ctx.req.param("id");
  const couponID = ctx.req.param("couponID");

  if (!eventID) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  if (!couponID) {
    throw new ApiError("Coupon ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await toggleCoupon(couponID, eventID, user.id);
  return ctx.json(result, 200);
};

/**
 * A controller function that deletes a coupon of an event.
 *
 * @param {Context} ctx - A hono context.
 *
 * @returns A success response if the coupon is deleted.
 *
 * @throws
 * - An ApiError if event ID is not provided.
 * - An ApiError if coupon ID is not provided.
 */
export const _deleteCoupon = async (ctx: Context) => {
  const user = ctx.get("user");

  const eventID = ctx.req.param("id");
  const couponID = ctx.req.param("couponID");

  if (!eventID) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  if (!couponID) {
    throw new ApiError("Coupon ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await deleteCoupon(couponID, eventID, user.id);
  return ctx.json(result, 200);
};

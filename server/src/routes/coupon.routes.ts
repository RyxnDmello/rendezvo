import { Hono } from "hono";

import {
  _addCoupon,
  _fetchCoupon,
  _fetchCoupons,
  _updateCoupon,
  _toggleCoupon,
  _deleteCoupon,
} from "@controllers/coupon.controller";

import authorize from "@middlewares/authorize.middleware";

import fetchCouponValidator from "@validators/coupon/fetchCoupon.validator";
import fetchCouponsValidator from "@validators/coupon/fetchCoupons.validator";

import addCouponValidator from "@validators/coupon/addCoupon.validator";
import updateCouponValidator from "@validators/coupon/updateCoupon.validator";
import toggleCouponValidator from "@validators/coupon/toggleCoupon.validator";
import deleteCouponValidator from "@validators/coupon/deleteCoupon.validator";

const router = new Hono();

router
  .basePath("/")
  .get(authorize, fetchCouponsValidator, _fetchCoupons)
  .post(authorize, addCouponValidator, _addCoupon);
router
  .basePath("/:couponID")
  .get(authorize, fetchCouponValidator, _fetchCoupon)
  .patch(authorize, updateCouponValidator, _updateCoupon)
  .delete(authorize, deleteCouponValidator, _deleteCoupon);
router
  .basePath("/:couponID/toggle")
  .patch(authorize, toggleCouponValidator, _toggleCoupon);

export default router;

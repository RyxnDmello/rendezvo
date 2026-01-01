import { Hono } from "hono";

import {
  _addCoupon,
  _fetchCoupon,
  _fetchCoupons,
  _updateCoupon,
  _toggleCoupon,
  _deleteCoupon,
} from "@controllers/coupon.controller";

import { authorizeOrganizer } from "@middlewares/authorize.middleware";

import addCouponValidator from "@validators/coupon/addCoupon.validator";
import updateCouponValidator from "@validators/coupon/updateCoupon.validator";

const router = new Hono();

router
  .basePath("/")
  .get(authorizeOrganizer, _fetchCoupons)
  .post(authorizeOrganizer, addCouponValidator, _addCoupon);
router
  .basePath("/:couponID")
  .get(authorizeOrganizer, _fetchCoupon)
  .patch(authorizeOrganizer, updateCouponValidator, _updateCoupon)
  .delete(authorizeOrganizer, _deleteCoupon);
router.basePath("/:couponID/toggle").patch(authorizeOrganizer, _toggleCoupon);

export default router;

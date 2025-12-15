import { Hono } from "hono";

import {
  _fetchEvent,
  _fetchEvents,
  _createEvent,
  _updateEvent,
  _uploadEventMedia,
  _uploadEventCover,
  _uploadEventImage,
  _uploadEventVideo,
  _uploadEventBanner,
  _deleteEventMedia,
  _deleteEventCover,
  _deleteEventImage,
  _deleteEventVideo,
  _deleteEventBanner,
} from "@controllers/event.controller";

import ticketRoutes from "./ticket.routes";
import couponRoutes from "./coupon.routes";

import authorize from "@middlewares/authorize.middleware";

import fetchEventsValidator from "@validators/event/fetchEvents.validator";
import createEventValidator from "@validators/event/createEvent.validator";
import updateEventValidator from "@validators/event/updateEvent.validator";

import uploadEventMediaValidator from "@validators/event/media/uploadEventMedia.validator";
import uploadEventCoverValidator from "@validators/event/media/uploadEventCover.validator";
import uploadEventImageValidator from "@validators/event/media/uploadEventImage.validator";
import uploadEventVideoValidator from "@validators/event/media/uploadEventVideo.validator";
import uploadEventBannerValidator from "@validators/event/media/uploadEventBanner.validator";

import deleteEventImageValidator from "@validators/event/media/deleteEventImage.validator";
import deleteEventVideoValidator from "@validators/event/media/deleteEventVideo.validator";

const router = new Hono();

router
  .basePath("/")
  .get(authorize, fetchEventsValidator, _fetchEvents)
  .post(authorize, createEventValidator, _createEvent);
router
  .basePath("/:id")
  .get(authorize, _fetchEvent)
  .patch(authorize, updateEventValidator, _updateEvent);
router
  .basePath("/:id/media")
  .patch(authorize, uploadEventMediaValidator, _uploadEventMedia)
  .delete(authorize, _deleteEventMedia);
router
  .basePath("/:id/media/cover")
  .patch(authorize, uploadEventCoverValidator, _uploadEventCover)
  .delete(authorize, _deleteEventCover);
router
  .basePath("/:id/media/banner")
  .patch(authorize, uploadEventBannerValidator, _uploadEventBanner)
  .delete(authorize, _deleteEventBanner);
router
  .basePath("/:id/media/image")
  .patch(authorize, uploadEventImageValidator, _uploadEventImage)
  .delete(authorize, deleteEventImageValidator, _deleteEventImage);
router
  .basePath("/:id/media/video")
  .patch(authorize, uploadEventVideoValidator, _uploadEventVideo)
  .delete(authorize, deleteEventVideoValidator, _deleteEventVideo);

router.route("/:id/ticket", ticketRoutes);
router.route("/:id/coupon", couponRoutes);

export default router;

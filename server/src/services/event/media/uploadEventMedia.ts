import EventModel from "@models/event.model";

import { UploadEventMediaValidatorSchema } from "@validators/event/media/uploadEventMedia.validator";

import {
  uploadCover,
  updateCover,
  uploadBanner,
  updateBanner,
} from "../helpers/storage";

import ApiError from "@utils/ApiError";

/**
 * A service function that uploads event's cover and banner image.
 *
 * This function validates event existence and organizer authorization.
 * It uploads or updates both cover and banner in storage and updates the database.
 *
 * @param {string} id - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 * @param {UploadEventMediaValidatorSchema} data - The validated upload media payload.
 *
 * @returns A success response if the media is uploaded.
 *
 * @throws
 * - An ApiError if event does not exist.
 * - An ApiError if organizer is not authorized.
 * - An ApiError if upload operation fails.
 */
const uploadEventMedia = async (
  id: string,
  ownerID: string,
  data: UploadEventMediaValidatorSchema,
) => {
  const dbEvent = await EventModel.findById(id, {
    owner: 1,
    album: 1,
  }).lean({
    versionKey: false,
  });

  if (!dbEvent) {
    throw new ApiError("Event With Given ID Does Not Exist", "BAD_REQUEST");
  }

  if (dbEvent.owner.toString() !== ownerID) {
    throw new ApiError(
      "You Are Not Authorized To Update This Event",
      "FORBIDDEN",
    );
  }

  const [coverID, bannerID] = await Promise.all([
    dbEvent.album?.cover
      ? updateCover(id, data.cover)
      : uploadCover(id, data.cover),
    dbEvent.album?.banner
      ? updateBanner(id, data.banner)
      : uploadBanner(id, data.banner),
  ]);

  const { acknowledged, modifiedCount } = await EventModel.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        album: {
          ...dbEvent.album,
          cover: {
            id: coverID,
            type: "image",
          },
          banner: {
            id: bannerID,
            type: "image",
          },
        },
      },
    },
  );

  if (!acknowledged || modifiedCount !== 1) {
    throw new ApiError(
      "Unable To Upload Media Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }

  return {
    success: true,
  };
};

export default uploadEventMedia;

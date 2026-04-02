import EventModel from "@models/event.model";

import { UploadEventBannerValidatorSchema } from "@validators/event/media/uploadEventBanner.validator";

import { uploadBanner, updateBanner } from "../helpers/storage";

import ApiError from "@utils/ApiError";

/**
 * A service function that uploads an event's banner image.
 *
 * This function validates event existence and organizer authorization.
 * It uploads or updates the banner in storage and updates the database.
 *
 * @param {string} id - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 * @param {UploadEventBannerValidatorSchema} data - The validated upload banner payload.
 *
 * @returns A success response if the banner is uploaded.
 *
 * @throws
 * - An ApiError if event does not exist.
 * - An ApiError if organizer is not authorized.
 * - An ApiError if upload operation fails.
 */
const uploadEventBanner = async (
  id: string,
  ownerID: string,
  data: UploadEventBannerValidatorSchema,
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

  const bannerID = dbEvent.album?.banner
    ? await updateBanner(id, data.banner)
    : await uploadBanner(id, data.banner);

  const { acknowledged, modifiedCount } = await EventModel.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        album: {
          ...dbEvent.album,
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
      "Unable To Upload Event Banner Image Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }

  return {
    success: true,
  };
};

export default uploadEventBanner;

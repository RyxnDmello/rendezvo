import EventModel from "@models/event.model";

import { UploadEventImageValidatorSchema } from "@validators/event/media/uploadEventImage.validator";

import { uploadImage } from "../helpers/storage";

import ApiError from "@utils/ApiError";

/**
 * A service function that uploads an event image.
 *
 * This function validates event existence and organizer authorization.
 * It ensures the maximum image limit is not exceeded, uploads the image,
 * and updates the album in the database.
 *
 * @param {string} id - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 * @param {UploadEventImageValidatorSchema} data - The validated upload image payload.
 *
 * @returns A success response if the image is uploaded.
 *
 * @throws
 * - An ApiError if event does not exist.
 * - An ApiError if organizer is not authorized.
 * - An ApiError if image limit is exceeded.
 * - An ApiError if upload operation fails.
 */
const uploadEventImage = async (
  id: string,
  ownerID: string,
  data: UploadEventImageValidatorSchema,
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

  if (dbEvent.album?.images?.length === 5) {
    throw new ApiError(
      "An Event Can Only Have A Maximum Of 5 Images",
      "BAD_REQUEST",
    );
  }

  const existingImages = dbEvent.album?.images || [];

  const index = existingImages.reduce((value, image) => {
    const current = parseInt(image.id[image.id.length - 1]!);
    return current - value === 1 ? current : value;
  }, 0);

  const imageID = await uploadImage(id, index + 1, data.image);

  const images = [
    ...existingImages.splice(0, index),
    {
      id: imageID,
      type: "image",
    },
    ...existingImages,
  ];

  const { acknowledged, modifiedCount } = await EventModel.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        album: {
          ...dbEvent.album,
          images,
        },
      },
    },
  );

  if (!acknowledged || modifiedCount !== 1) {
    throw new ApiError(
      "Unable To Upload Event Image Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }

  return {
    success: true,
  };
};

export default uploadEventImage;

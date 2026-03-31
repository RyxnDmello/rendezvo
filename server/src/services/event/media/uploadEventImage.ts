import EventModel from "@models/event.model";

import { UploadEventImageValidatorSchema } from "@validators/event/media/uploadEventImage.validator";

import { uploadImage } from "../helpers/storage";

import ApiError from "@utils/ApiError";

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

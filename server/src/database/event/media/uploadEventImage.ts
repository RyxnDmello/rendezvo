import EventModel from "@models/event.model";

import { UploadEventImageValidatorSchema } from "@validators/event/media/uploadEventImage.validator";

import { uploadImage } from "../helpers/storage";

import MongooseError, { isMongooseError } from "@utils/MongooseError";

import ApiError from "@utils/ApiError";

const uploadEventImage = async (
  id: string,
  data: UploadEventImageValidatorSchema
) => {
  try {
    const dbEvent = await EventModel.findById(id, {
      album: 1,
    }).lean({
      versionKey: false,
    });

    if (!dbEvent) {
      throw new ApiError("Event With Given ID Does Not Exist", "BAD_REQUEST");
    }

    if (dbEvent.album?.images?.length === 5) {
      throw new ApiError(
        "An Event Can Only Have A Maximum Of 5 Images",
        "BAD_REQUEST"
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
      }
    );

    if (!acknowledged || modifiedCount !== 1) {
      throw new ApiError(
        "Unable To Upload Event Image Due To Server Error",
        "INTERNAL_SERVER_ERROR"
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Upload Event Image Due To Server Error",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export default uploadEventImage;

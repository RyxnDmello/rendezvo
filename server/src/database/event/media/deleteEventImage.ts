import EventModel from "@models/event.model";

import { DeleteEventImageValidatorSchema } from "@validators/event/media/deleteEventImage.validator";

import { getImageID, deleteImage } from "../helpers/storage";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import AppwriteError, { isAppwriteError } from "@utils/AppwriteError";
import ApiError, { isApiError } from "@utils/ApiError";

const deleteEventImage = async (
  id: string,
  ownerID: string,
  data: DeleteEventImageValidatorSchema,
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

    if (dbEvent.ownerID !== ownerID) {
      throw new ApiError(
        "You Are Not Authorized To Update This Event",
        "FORBIDDEN",
      );
    }

    if (!dbEvent.album?.images) {
      return {
        success: true,
      };
    }

    const images = dbEvent.album.images.filter(
      (image) => image.id !== getImageID(id, data.index),
    );

    if (dbEvent.album.images.length === images.length) {
      throw new ApiError(
        "Event Image With Given Index Does Not Exist",
        "BAD_REQUEST",
      );
    }

    const [{ acknowledged, modifiedCount }, _] = await Promise.all([
      EventModel.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            "album.images": images.length === 0 ? null : images,
          },
        },
        {
          runValidators: true,
        },
      ),
      deleteImage(id, data.index),
    ]);

    if (!acknowledged || modifiedCount !== 1) {
      throw new ApiError(
        "Unable To Delete Event Image Due To Server Error",
        "INTERNAL_SERVER_ERROR",
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Delete Event Image Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

export default deleteEventImage;

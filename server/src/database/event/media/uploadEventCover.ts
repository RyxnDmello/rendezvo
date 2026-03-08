import EventModel from "@models/event.model";

import { UploadEventCoverValidatorSchema } from "@validators/event/media/uploadEventCover.validator";

import { uploadCover, updateCover } from "../helpers/storage";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import AppwriteError, { isAppwriteError } from "@utils/AppwriteError";
import ApiError, { isApiError } from "@utils/ApiError";

const uploadEventCover = async (
  id: string,
  ownerID: string,
  data: UploadEventCoverValidatorSchema,
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

    const coverID = dbEvent.album?.cover
      ? await updateCover(id, data.cover)
      : await uploadCover(id, data.cover);

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
          },
        },
      },
    );

    if (!acknowledged || modifiedCount !== 1) {
      throw new ApiError(
        "Unable To Upload Event Cover Image Due To Server Error",
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
      "Unable To Upload Event Cover Image Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

export default uploadEventCover;

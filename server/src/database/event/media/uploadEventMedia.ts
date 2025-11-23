import EventModel from "@models/event.model";

import { UploadEventMediaValidatorSchema } from "@validators/event/media/uploadEventMedia.validator";

import {
  uploadCover,
  updateCover,
  uploadBanner,
  updateBanner,
} from "../helpers/storage";

import MongooseError, { isMongooseError } from "@utils/MongooseError";

import AppwriteError from "@utils/AppwriteError";

import ApiError from "@utils/ApiError";

const uploadEventMedia = async (
  id: string,
  data: UploadEventMediaValidatorSchema
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
      }
    );

    if (!acknowledged || modifiedCount !== 1) {
      throw new ApiError(
        "Unable To Upload Media Due To Server Error",
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

    if (error instanceof AppwriteError) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Upload Media Due To Server Error",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export default uploadEventMedia;

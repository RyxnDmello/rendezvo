import EventModel from "@models/event.model";

import { UploadEventBannerValidatorSchema } from "@validators/event/media/uploadEventBanner.validator";

import { uploadBanner, updateBanner } from "../helpers/storage";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import AppwriteError, { isAppwriteError } from "@utils/AppwriteError";
import ApiError, { isApiError } from "@utils/ApiError";

const uploadEventBanner = async (
  id: string,
  data: UploadEventBannerValidatorSchema
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
      }
    );

    if (!acknowledged || modifiedCount !== 1) {
      throw new ApiError(
        "Unable To Upload Event Banner Image Due To Server Error",
        "INTERNAL_SERVER_ERROR"
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
      "Unable To Upload Event Banner Image Due To Server Error",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export default uploadEventBanner;

import EventModel from "@models/event.model";

import { deleteBanner } from "../helpers/storage";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import AppwriteError, { isAppwriteError } from "@utils/AppwriteError";
import ApiError, { isApiError } from "@utils/ApiError";

const deleteEventBanner = async (id: string, ownerID: string) => {
  try {
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

    if (!dbEvent.album?.banner) {
      return {
        success: true,
      };
    }

    const [{ acknowledged, modifiedCount }, _] = await Promise.all([
      EventModel.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            album: {
              ...dbEvent.album,
              banner: null,
            },
          },
        },
        {
          runValidators: true,
        },
      ),
      deleteBanner(id),
    ]);

    if (!acknowledged || modifiedCount !== 1) {
      throw new ApiError(
        "Unable To Delete Event Banner Image Due To Server Error",
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
      "Unable To Delete Event Banner Image Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

export default deleteEventBanner;

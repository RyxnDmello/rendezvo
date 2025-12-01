import EventModel from "@models/event.model";

import { DeleteEventVideoValidatorSchema } from "@validators/event/media/deleteEventVideo.validator";

import { getVideoID, deleteVideo } from "../helpers/storage";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import AppwriteError, { isAppwriteError } from "@utils/AppwriteError";
import ApiError, { isApiError } from "@utils/ApiError";

const deleteEventVideo = async (
  id: string,
  data: DeleteEventVideoValidatorSchema
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

    if (!dbEvent.album?.videos) {
      return {
        success: true,
      };
    }

    const videos = dbEvent.album.videos.filter(
      (image) => image.id !== getVideoID(id, data.index)
    );

    if (dbEvent.album.videos.length === videos.length) {
      throw new ApiError(
        "Event Video With Given Index Does Not Exist",
        "BAD_REQUEST"
      );
    }

    const [{ acknowledged, modifiedCount }, _] = await Promise.all([
      EventModel.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            "album.videos": videos.length === 0 ? null : videos,
          },
        },
        {
          runValidators: true,
        }
      ),
      deleteVideo(id, data.index),
    ]);

    if (!acknowledged || modifiedCount !== 1) {
      throw new ApiError(
        "Unable To Delete Event Video Due To Server Error",
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
      "Unable To Delete Event Video Due To Server Error",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export default deleteEventVideo;

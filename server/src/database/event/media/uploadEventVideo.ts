import EventModel from "@models/event.model";

import { UploadEventVideoValidatorSchema } from "@validators/event/media/uploadEventVideo.validator";

import { uploadVideo } from "../helpers/storage";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import AppwriteError, { isAppwriteError } from "@utils/AppwriteError";
import ApiError, { isApiError } from "@utils/ApiError";

const uploadEventVideo = async (
  id: string,
  ownerID: string,
  data: UploadEventVideoValidatorSchema,
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

    if (dbEvent.album?.videos?.length === 5) {
      throw new ApiError(
        "An Event Can Have A Maximum Of 5 Videos",
        "BAD_REQUEST",
      );
    }

    const existingVideos = dbEvent.album?.videos || [];

    const index = existingVideos.reduce((value, image) => {
      const current = parseInt(image.id[image.id.length - 1]!);
      return current - value === 1 ? current : value;
    }, 0);

    const videoID = await uploadVideo(id, index + 1, data.video);

    const videos = [
      ...existingVideos.splice(0, index),
      {
        id: videoID,
        type: "video",
      },
      ...existingVideos,
    ];

    for (const [key, image] of existingVideos.entries()) {
      if (key === index) {
        videos.push({
          id: videoID,
          type: "image",
        });

        videos.push(image);
        continue;
      }

      videos.push(image);
    }

    const { acknowledged, modifiedCount } = await EventModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          album: {
            ...dbEvent.album,
            videos,
          },
        },
      },
    );

    if (!acknowledged || modifiedCount !== 1) {
      throw new ApiError(
        "Unable To Upload Event Video Due To Server Error",
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
      "Unable To Upload Event Video Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

export default uploadEventVideo;

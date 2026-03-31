import EventModel from "@models/event.model";

import { DeleteEventVideoValidatorSchema } from "@validators/event/media/deleteEventVideo.validator";

import { getVideoID, deleteVideo } from "../helpers/storage";

import ApiError from "@utils/ApiError";

const deleteEventVideo = async (
  id: string,
  ownerID: string,
  data: DeleteEventVideoValidatorSchema,
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

  if (!dbEvent.album?.videos) {
    return {
      success: true,
    };
  }

  const videos = dbEvent.album.videos.filter(
    (image) => image.id !== getVideoID(id, data.index),
  );

  if (dbEvent.album.videos.length === videos.length) {
    throw new ApiError(
      "Event Video With Given Index Does Not Exist",
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
          "album.videos": videos.length === 0 ? null : videos,
        },
      },
      {
        runValidators: true,
      },
    ),
    deleteVideo(id, data.index),
  ]);

  if (!acknowledged || modifiedCount !== 1) {
    throw new ApiError(
      "Unable To Delete Event Video Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }

  return {
    success: true,
  };
};

export default deleteEventVideo;

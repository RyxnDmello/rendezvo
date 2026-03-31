import EventModel from "@models/event.model";

import { UploadEventCoverValidatorSchema } from "@validators/event/media/uploadEventCover.validator";

import { uploadCover, updateCover } from "../helpers/storage";

import ApiError from "@utils/ApiError";

const uploadEventCover = async (
  id: string,
  ownerID: string,
  data: UploadEventCoverValidatorSchema,
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
};

export default uploadEventCover;

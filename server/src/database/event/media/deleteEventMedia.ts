import EventModel from "@models/event.model";

import { deleteCover, deleteBanner } from "../helpers/storage";

import MongooseError, { isMongooseError } from "@utils/MongooseError";

import ApiError from "@utils/ApiError";

const deleteEventMedia = async (id: string) => {
  try {
    const dbEvent = await EventModel.findById(id, {
      album: 1,
    }).lean({
      versionKey: false,
    });

    if (!dbEvent) {
      throw new ApiError("Event With Given ID Does Not Exist", "BAD_REQUEST");
    }

    if (!dbEvent.album?.cover && !dbEvent.album?.banner) {
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
              cover: null,
              banner: null,
            },
          },
        },
        {
          runValidators: true,
        }
      ),
      Promise.all([
        dbEvent.album?.cover ? deleteCover(id) : undefined,
        dbEvent.album?.banner ? deleteBanner(id) : undefined,
      ]),
    ]);

    if (!acknowledged || modifiedCount !== 1) {
      throw new ApiError(
        "Unable To Delete Media Due To Server Error",
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
      "Unable To Delete Media Due To Server Error",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export default deleteEventMedia;

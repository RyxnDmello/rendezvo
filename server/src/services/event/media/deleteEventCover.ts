import EventModel from "@models/event.model";

import { deleteCover } from "../helpers/storage";

import ApiError from "@utils/ApiError";

/**
 * A service function that deletes an event's cover image.
 *
 * This function validates event existence and organizer authorization.
 * It removes the cover reference from the database and deletes the stored file.
 *
 * @param {string} id - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns A success response if the cover is deleted.
 *
 * @throws
 * - An ApiError if event does not exist.
 * - An ApiError if organizer is not authorized.
 * - An ApiError if delete operation fails.
 */
const deleteEventCover = async (id: string, ownerID: string) => {
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

  if (!dbEvent.album?.cover) {
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
          },
        },
      },
      {
        runValidators: true,
      },
    ),
    deleteCover(id),
  ]);

  if (!acknowledged || modifiedCount !== 1) {
    throw new ApiError(
      "Unable To Delete Event Cover Image Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }

  return {
    success: true,
  };
};

export default deleteEventCover;

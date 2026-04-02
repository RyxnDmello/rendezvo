import OrganizerModel, { Organizer } from "@models/organizer.model";

import { getCachedOrganizer, setCachedOrganizer } from "./helpers/redis";

import ApiError from "@utils/ApiError";

/**
 * A service function that retrieves an organizer.
 *
 * The data is stored in cache, for a period of time, after the first call.
 * Every subsequent request returns the cached data.
 *
 * @param {string} id - The ID of the organizer.
 *
 * @returns The organizer data.
 */
const fetchOrganizer = async (id: string) => {
  const organizer = (await getCachedOrganizer(id)) ?? (await getOrganizer(id));
  return organizer as Organizer;
};

/**
 * A service helper function that retrieves an organizer from the database.
 *
 * This function fetches the organizer, validates its existence and verification status,
 * transforms the response, and stores it in cache.
 *
 * @param {string} id - The ID of the organizer.
 *
 * @returns The organizer data.
 *
 * @throws
 * - An ApiError if organizer does not exist.
 * - An ApiError if organizer is not verified.
 */
const getOrganizer = async (id: string) => {
  const dbOrganizer = await OrganizerModel.findById(id, {
    password: 0,
    createdAt: 0,
    updatedAt: 0,
  }).lean({
    versionKey: false,
  });

  if (!dbOrganizer) {
    throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
  }

  if (!dbOrganizer.verified) {
    throw new ApiError(
      "Unable To Proceed Since Account Has Not Been Verified",
      "ACCOUNT_LOCKED",
    );
  }

  const { _id, ...data } = dbOrganizer;

  const organizer = {
    id,
    ...data,
  };

  await setCachedOrganizer(id, organizer);

  return organizer;
};

export default fetchOrganizer;

import OrganizerModel, { Organizer } from "@models/organizer.model";

import { getCachedOrganizer, setCachedOrganizer } from "./helpers/redis";

import ApiError from "@utils/ApiError";

const fetchOrganizer = async (id: string) => {
  const organizer = (await getCachedOrganizer(id)) ?? (await getOrganizer(id));
  return organizer as Organizer;
};

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

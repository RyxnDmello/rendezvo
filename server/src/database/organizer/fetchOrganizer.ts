import OrganizerModel from "@models/organizer.model";

const fetchOrganizer = async (id: string) => {
  try {
    const dbOrganizer = await OrganizerModel.findOne(
      {
        _id: id,
      },
      {
        password: 0,
        createdAt: 0,
        updatedAt: 0,
      }
    ).lean({
      versionKey: false,
    });

    if (!dbOrganizer) {
      throw new Error("User With Given ID Does Not Exist");
    }

    const { _id, ...data } = dbOrganizer;

    return {
      id: _id,
      ...data,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Unable To Retrieve User Due To Server Error");
  }
};

export default fetchOrganizer;

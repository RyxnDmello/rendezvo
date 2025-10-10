import OrganizerModel from "@models/organizer.model";

type Query = {
  name?: {
    $regex: string;
    $options: "i";
  };
  email?: {
    $regex: string;
    $options: "i";
  };
};

const fetchOrganizers = async (
  name?: string,
  email?: string,
  limit: number = 0
) => {
  const query: Query = {};

  if (name !== undefined) {
    query.name = {
      $regex: name,
      $options: "i",
    };
  }

  if (email !== undefined) {
    query.email = {
      $regex: email,
      $options: "i",
    };
  }

  try {
    const dbOrganizers = await OrganizerModel.find(query, {
      password: 0,
      createdAt: 0,
      updatedAt: 0,
    })
      .lean({
        versionKey: false,
      })
      .limit(limit);

    return dbOrganizers.map((organizer) => {
      const { _id, ...data } = organizer;

      return {
        id: _id,
        ...data,
      };
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Unable To Retrieve Users Due To Server Error");
  }
};

export default fetchOrganizers;

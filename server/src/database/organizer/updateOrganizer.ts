import OrganizerModel from "@models/organizer.model";

import { UpdateSchema } from "@validators/organizer/update.validator";

const updateOrganizer = async (id: string, data: UpdateSchema) => {
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

    if (data.mobile && data.mobile !== dbOrganizer.mobile) {
      const dbOrganizerWithMobile = await OrganizerModel.exists({
        mobile: data.mobile,
      });

      if (dbOrganizerWithMobile) {
        throw new Error("User With Given Mobile Number Already Exists");
      }
    }

    const { acknowledged, modifiedCount } = await OrganizerModel.updateOne(
      {
        _id: dbOrganizer._id,
      },
      data
    );

    if (!acknowledged || modifiedCount !== 1) {
      throw new Error("Unable To Update User Due To Server");
    }

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Unable To Update User Due To Server");
  }
};

export default updateOrganizer;

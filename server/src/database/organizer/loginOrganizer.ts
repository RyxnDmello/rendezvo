import { password } from "bun";

import OrganizerModel from "@models/organizer.model";

import { LoginSchema } from "@validators/organizer/login.validator";

const loginOrganizer = async (data: LoginSchema) => {
  try {
    const dbOrganizer = await OrganizerModel.findOne(
      {
        email: data.email,
      },
      {
        name: 1,
        email: 1,
        mobile: 1,
        password: 1,
        verified: 1,
      }
    ).lean({
      versionKey: false,
    });

    if (!dbOrganizer) {
      throw new Error("User With Given Email Address Does Not Exist");
    }

    if (!dbOrganizer.password) {
      throw new Error("Please Try A Different Method To Login");
    }

    const verified = await password.verify(
      data.password,
      dbOrganizer.password,
      "bcrypt"
    );

    if (!verified) {
      throw new Error("Invalid Password");
    }

    return {
      id: dbOrganizer._id,
      name: dbOrganizer.name,
      email: dbOrganizer.email,
      mobile: dbOrganizer.mobile,
      verified: dbOrganizer.verified,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Unable To Login Due To Server Error");
  }
};

export default loginOrganizer;

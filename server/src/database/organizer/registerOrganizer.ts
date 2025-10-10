import { password } from "bun";

import OrganizerModel from "@models/organizer.model";

import { RegisterSchema } from "@validators/organizer/register.validator";

const registerOrganizer = async (data: RegisterSchema) => {
  try {
    const [dbOrganizerWithEmail, dbOrganizerWithMobile] = await Promise.all([
      await OrganizerModel.exists({
        email: data.email,
      }),
      await OrganizerModel.exists({
        mobile: data.mobile,
      }),
    ]);

    if (dbOrganizerWithEmail) {
      throw new Error("User With Given Email Address Already Exists");
    }

    if (dbOrganizerWithMobile) {
      throw new Error("User With Given Mobile Number Already Exists");
    }

    const encrypted = await password.hash(data.password!, {
      algorithm: "bcrypt",
      cost: 12,
    });

    const newOrganizer = new OrganizerModel({
      ...data,
      password: encrypted,
    });

    await newOrganizer.save();

    return {
      id: newOrganizer.id,
      name: newOrganizer.name,
      email: newOrganizer.email,
      mobile: newOrganizer.mobile,
      verified: newOrganizer.verified,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Unable To Create Account Due To Server Error");
  }
};

export default registerOrganizer;

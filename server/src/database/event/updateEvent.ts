import EventModel, { Event } from "@models/event.model";

import { UpdateEventValidatorSchema } from "@validators/event/updateEvent.validator";

import { clearCachedEvent, clearCachedEvents } from "./helpers/redis";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const updateEvent = async (
  id: string,
  ownerID: string,
  data: UpdateEventValidatorSchema,
) => {
  try {
    const dbEvent = await EventModel.findById(id, {
      createdAt: 0,
      updatedAt: 0,
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

    const { action, ...event } = data;

    if (action === "rsvp") {
      if (dbEvent.attendance === "open") {
        throw new ApiError(
          "Open Attendance Events Cannot Have RSVP Details",
          "BAD_REQUEST",
        );
      }

      await Promise.all([
        clearCachedEvents(ownerID),
        clearCachedEvent(id, ownerID),
      ]);

      return await updateRsvp(id, dbEvent, data);
    }

    if (action === "security") {
      if (dbEvent.visibility === "public") {
        throw new ApiError(
          "Public Visibility Events Cannot Have Security Codes",
          "BAD_REQUEST",
        );
      }

      await Promise.all([
        clearCachedEvents(ownerID),
        clearCachedEvent(id, ownerID),
      ]);

      return await updateSecurity(id, dbEvent, data);
    }

    const { acknowledged, modifiedCount } = await EventModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          ...event,
        },
      },
      {
        runValidators: true,
      },
    );

    if (!acknowledged || modifiedCount !== 1) {
      throw new ApiError(
        "Unable To Update Event Due To Server Error",
        "INTERNAL_SERVER_ERROR",
      );
    }

    await Promise.all([
      clearCachedEvents(ownerID),
      clearCachedEvent(id, ownerID),
    ]);

    return {
      success: true,
    };
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Update Event Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

const updateRsvp = async (
  id: string,
  event: Event,
  data: UpdateEventValidatorSchema,
) => {
  const prevFields = new Map(
    event.rsvp!.fields.map((field) => [field.name, field]),
  );

  const newFields = new Map(
    data.rsvp!.fields.map((field) => [field.name, field]),
  );

  for (const [name, newField] of newFields) {
    prevFields.set(name, {
      type: newField.type,
      name: newField.name,
      label: newField.label,
      active: newField.active,
      placeholder: newField.placeholder,
      options: newField.options ?? null,
      validator: {
        required: newField.validator.required,
        min: newField.validator.min ?? null,
        max: newField.validator.max ?? null,
        minDate: newField.validator.minDate
          ? new Date(newField.validator.minDate)
          : null,
        maxDate: newField.validator.maxDate
          ? new Date(newField.validator.maxDate)
          : null,
        minLength: newField.validator.minLength ?? null,
        maxLength: newField.validator.maxLength ?? null,
      },
    });
  }

  const fields = prevFields.values().toArray();

  const { acknowledged, modifiedCount } = await EventModel.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        "rsvp.fields": fields,
      },
    },
    {
      runValidators: true,
    },
  );

  if (!acknowledged || modifiedCount !== 1) {
    throw new ApiError(
      "Unable To Update Event Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }

  return {
    success: true,
  };
};

const updateSecurity = async (
  id: string,
  event: Event,
  data: UpdateEventValidatorSchema,
) => {
  const prevCodes = new Map(
    event.security!.codes.map((code) => [code.code, code]),
  );

  const newCodes = new Map(
    data.security!.codes.map((code) => [code.code, code]),
  );

  for (const [code, newCode] of newCodes) {
    prevCodes.set(code, {
      type: newCode.type,
      active: newCode.active,
      code: newCode.code,
      uses: newCode.uses,
      expiry: newCode.expiry ? new Date(newCode.expiry) : null,
    });
  }

  const codes = prevCodes.values().toArray();

  const { acknowledged, modifiedCount } = await EventModel.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        "security.codes": codes,
      },
    },
    {
      runValidators: true,
    },
  );

  if (!acknowledged || modifiedCount !== 1) {
    throw new ApiError(
      "Unable To Update Event Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }

  return {
    success: true,
  };
};

export default updateEvent;

import EventModel, { Event } from "@models/event.model";

import { UpdateEventValidatorSchema } from "@validators/event/updateEvent.validator";

import { clearCachedEvent, clearCachedEvents } from "./helpers/redis";

import ApiError from "@utils/ApiError";

/**
 * A service function that updates an organizer's event.
 *
 * This function validates event existence and access permissions.
 * It updates event data based on the provided action and clears related cache.
 *
 * @param {string} id - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 * @param {UpdateEventValidatorSchema} data - The validated update event payload.
 *
 * @returns A success response if the event is updated.
 *
 * @throws
 * - An ApiError if event does not exist.
 * - An ApiError if access is not authorized.
 * - An ApiError if update operation fails.
 */
const updateEvent = async (
  id: string,
  ownerID: string,
  data: UpdateEventValidatorSchema,
) => {
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
};

/**
 * A service helper function that updates RSVP configuration for an event.
 *
 * This function merges existing and new RSVP fields and updates them in the database.
 *
 * @param {string} id - The ID of the event.
 * @param {Event} event - The existing event data.
 * @param {UpdateEventValidatorSchema} data - The validated update payload.
 *
 * @returns A success response if RSVP is updated.
 *
 * @throws An ApiError if update operation fails.
 */
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

/**
 * A service helper function that updates security configuration for an event.
 *
 * This function merges existing and new security codes and updates them in the database.
 *
 * @param {string} id - The ID of the event.
 * @param {Event} event - The existing event data.
 * @param {UpdateEventValidatorSchema} data - The validated update payload.
 *
 * @returns A success response if security is updated.
 *
 * @throws An ApiError if update operation fails.
 */
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

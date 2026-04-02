import {
  getID,
  getFile,
  uploadFile,
  updateFile,
  deleteFile,
} from "@helpers/storage";

import ApiError from "@utils/ApiError";

import AppwriteError, {
  isAppwriteError,
  AppwriteErrorTypes,
} from "@utils/AppwriteError";

/**
 * A service helper function that generates the organizer's profile image file ID.
 *
 * @param {string} id - The ID of the organizer.
 *
 * @returns The storage file ID for the organizer profile.
 */
export const getProfileID = (id: string) => {
  return `ORGANIZER_${getID(id)}_PROFILE`;
};

/**
 * A service helper function that generates the organizer's banner image file ID.
 *
 * @param {string} id - The ID of the organizer.
 *
 * @returns The storage file ID for the organizer banner.
 */
export const getBannerID = (id: string) => {
  return `ORGANIZER_${getID(id)}_BANNER`;
};

/**
 * A service helper function that retrieves the organizer profile file.
 *
 * This function fetches the profile file from storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the organizer.
 *
 * @returns The profile file.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if retrieval fails due to server error.
 */
export const getProfile = async (id: string) => {
  try {
    return await getFile(getProfileID(id));
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Retrieve Profile Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that retrieves the organizer banner file.
 *
 * This function fetches the banner file from storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the organizer.
 *
 * @returns The banner file.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if retrieval fails due to server error.
 */
export const getBanner = async (id: string) => {
  try {
    return await getFile(getBannerID(id));
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Retrieve Banner Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that uploads the organizer profile file.
 *
 * This function uploads the profile file to storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the organizer.
 * @param {File} file - The file to be uploaded.
 *
 * @returns The uploaded file ID.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if upload fails due to server error.
 */
export const uploadProfile = async (id: string, file: File) => {
  try {
    return await uploadFile(getProfileID(id), file);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Upload Image Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that uploads the organizer banner file.
 *
 * This function uploads the banner file to storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the organizer.
 * @param {File} file - The file to be uploaded.
 *
 * @returns The uploaded file ID.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if upload fails due to server error.
 */
export const uploadBanner = async (id: string, file: File) => {
  try {
    return await uploadFile(getBannerID(id), file);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Upload Banner Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that updates the organizer profile file.
 *
 * This function updates the profile file in storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the organizer.
 * @param {File} file - The file to be updated.
 *
 * @returns The updated file ID.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if update fails due to server error.
 */
export const updateProfile = async (id: string, file: File) => {
  try {
    return await updateFile(getProfileID(id), file);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Update Profile Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that updates the organizer banner file.
 *
 * This function updates the banner file in storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the organizer.
 * @param {File} file - The file to be updated.
 *
 * @returns The updated file ID.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if update fails due to server error.
 */
export const updateBanner = async (id: string, file: File) => {
  try {
    return await updateFile(getBannerID(id), file);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Update Banner Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that deletes the organizer profile file.
 *
 * This function removes the profile file from storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the organizer.
 *
 * @returns A success response if the profile is deleted.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if delete fails due to server error.
 */
export const deleteProfile = async (id: string) => {
  try {
    await deleteFile(getProfileID(id));

    return {
      success: true,
    };
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Delete Profile Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that deletes the organizer banner file.
 *
 * This function removes the banner file from storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the organizer.
 *
 * @returns A success response if the banner is deleted.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if delete fails due to server error.
 */
export const deleteBanner = async (id: string) => {
  try {
    await deleteFile(getBannerID(id));

    return {
      success: true,
    };
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Delete Banner Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

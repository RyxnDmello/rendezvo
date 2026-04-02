import { Query } from "node-appwrite";

import {
  getID,
  getFile,
  getFiles,
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
 * A service helper function that generates the cover file ID for an event.
 *
 * @param {string} id - The ID of the event.
 *
 * @returns The storage file ID for the event cover.
 */
export const getCoverID = (id: string) => {
  return `EVENT_${getID(id)}_COVER`;
};

/**
 * A service helper function that generates the banner file ID for an event.
 *
 * @param {string} id - The ID of the event.
 *
 * @returns The storage file ID for the event banner.
 */
export const getBannerID = (id: string) => {
  return `EVENT_${getID(id)}_BANNER`;
};

/**
 * A service helper function that generates the image file ID for an event.
 *
 * @param {string} id - The ID of the event.
 * @param {number} index - The image index.
 *
 * @returns The storage file ID for the event image.
 */
export const getImageID = (id: string, index: number) => {
  return `EVENT_${getID(id)}_IMAGE_${index}`;
};

/**
 * A service helper function that generates the image file ID for an event.
 *
 * @param {string} id - The ID of the event.
 * @param {number} index - The image index.
 *
 * @returns The storage file ID for the event image.
 */
export const getVideoID = (id: string, index: number) => {
  return `EVENT_${getID(id)}_VIDEO_${index}`;
};

/**
 * A service helper function that retrieves the event cover image.
 *
 * This function fetches the cover file from storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the event.
 *
 * @returns The cover file.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if retrieval fails due to server error.
 */
export const getCover = async (id: string) => {
  try {
    return await getFile(getCoverID(id));
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Retrieve Event Cover Image Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that retrieves the event banner image.
 *
 * This function fetches the banner file from storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the event.
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
      "Unable To Retrieve Event Banner Image Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that retrieves the event image.
 *
 * This function fetches the event image file from storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the event.
 *
 * @returns The event image file.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if retrieval fails due to server error.
 */
export const getImage = async (id: string, index: number) => {
  try {
    return await getFile(getImageID(id, index));
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Retrieve Event Banner Image Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that retrieves event images.
 *
 * This function fetches event image files from storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the event.
 *
 * @returns A list of event image files.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if retrieval fails due to server error.
 */
export const getImages = async (id: string) => {
  try {
    return await getFiles([
      Query.startsWith("$id", `EVENT_${getID(id)}_IMAGE_`),
    ]);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Retrieve Event Images Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that retrieves the event video.
 *
 * This function fetches the event video file from storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the event.
 *
 * @returns The event video file.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if retrieval fails due to server error.
 */
export const getVideo = async (id: string, index: number) => {
  try {
    return await getFile(getVideoID(id, index));
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Retrieve Event Banner Video Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that retrieves event videos.
 *
 * This function fetches event video files from storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the event.
 *
 * @returns A list of event video files.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if retrieval fails due to server error.
 */
export const getVideos = async (id: string) => {
  try {
    return await getFiles([
      Query.startsWith("$id", `EVENT_${getID(id)}_VIDEO_`),
    ]);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Retrieve Event Videos Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that uploads the event cover image.
 *
 * This function uploads the file to storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the event.
 * @param {File} file - The file to be uploaded.
 *
 * @returns The uploaded file ID.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if upload fails due to server error.
 */
export const uploadCover = async (id: string, file: File) => {
  try {
    return await uploadFile(getCoverID(id), file);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Upload Event Cover Image Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that uploads the event banner image.
 *
 * This function uploads the file to storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the event.
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
      "Unable To Upload Event Banner Image Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that uploads an event image.
 *
 * This function uploads the file to storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the event.
 * @param {File} file - The file to be uploaded.
 *
 * @returns The uploaded file ID.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if upload fails due to server error.
 */
export const uploadImage = async (id: string, index: number, file: File) => {
  try {
    return await uploadFile(getImageID(id, index), file);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Upload Event Image Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that uploads an event video.
 *
 * This function uploads the file to storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the event.
 * @param {File} file - The file to be uploaded.
 *
 * @returns The uploaded file ID.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if upload fails due to server error.
 */
export const uploadVideo = async (id: string, index: number, file: File) => {
  try {
    return await uploadFile(getVideoID(id, index), file);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Upload Event Video Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that updates the event cover image.
 *
 * This function updates the file in storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the event.
 * @param {File} file - The file to be updated.
 *
 * @returns The updated file ID.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if update fails due to server error.
 */
export const updateCover = async (id: string, file: File) => {
  try {
    return await updateFile(getCoverID(id), file);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Update Event Cover Image Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that updates the event banner image.
 *
 * This function updates the file in storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the event.
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
      "Unable To Update Event Banner Image Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that updates an event image.
 *
 * This function updates the file in storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the event.
 * @param {File} file - The file to be updated.
 *
 * @returns The updated file ID.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if update fails due to server error.
 */
export const updateImage = async (id: string, index: number, file: File) => {
  try {
    return await updateFile(getImageID(id, index), file);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Update Event Image Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that updates an event video.
 *
 * This function updates the file in storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the event.
 * @param {File} file - The file to be updated.
 *
 * @returns The updated file ID.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if update fails due to server error.
 */
export const updateVideo = async (id: string, index: number, file: File) => {
  try {
    return await updateFile(getVideoID(id, index), file);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Update Event Video Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that deletes the event cover image.
 *
 * This function removes the file from storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the event.
 *
 * @returns A success response if the file is deleted.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if delete fails due to server error.
 */
export const deleteCover = async (id: string) => {
  try {
    await deleteFile(getCoverID(id));

    return {
      success: true,
    };
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Delete Event Cover Image Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that deletes the event banner image.
 *
 * This function removes the file from storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the event.
 *
 * @returns A success response if the file is deleted.
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
      "Unable To Delete Event Banner Image Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that deletes an event image.
 *
 * This function removes the file from storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the event.
 *
 * @returns A success response if the file is deleted.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if delete fails due to server error.
 */
export const deleteImage = async (id: string, index: number) => {
  try {
    await deleteFile(getImageID(id, index));

    return {
      success: true,
    };
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Delete Event Image Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

/**
 * A service helper function that deletes an event video.
 *
 * This function removes the file from storage and handles storage-related errors.
 *
 * @param {string} id - The ID of the event.
 *
 * @returns A success response if the file is deleted.
 *
 * @throws
 * - An AppwriteError if a storage error occurs.
 * - An ApiError if delete fails due to server error.
 */
export const deleteVideo = async (id: string, index: number) => {
  try {
    await deleteFile(getVideoID(id, index));

    return {
      success: true,
    };
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error as AppwriteErrorTypes);
    }

    throw new ApiError(
      "Unable To Delete Event Video Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

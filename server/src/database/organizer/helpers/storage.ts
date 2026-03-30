import {
  getID,
  getFile,
  uploadFile,
  updateFile,
  deleteFile,
} from "@helpers/storage";

import ApiError from "@utils/ApiError";

import AppwriteError, { isAppwriteError } from "@utils/AppwriteError";

export const getProfileID = (id: string) => {
  return `ORGANIZER_${getID(id)}_PROFILE`;
};

export const getBannerID = (id: string) => {
  return `ORGANIZER_${getID(id)}_BANNER`;
};

export const getProfile = async (id: string) => {
  try {
    return await getFile(getProfileID(id));
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Retrieve Profile Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

export const getBanner = async (id: string) => {
  try {
    return await getFile(getBannerID(id));
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Retrieve Banner Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

export const uploadProfile = async (id: string, file: File) => {
  try {
    return await uploadFile(getProfileID(id), file);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Upload Image Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

export const uploadBanner = async (id: string, file: File) => {
  try {
    return await uploadFile(getBannerID(id), file);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Upload Banner Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

export const updateProfile = async (id: string, file: File) => {
  try {
    return await updateFile(getProfileID(id), file);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Update Profile Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

export const updateBanner = async (id: string, file: File) => {
  try {
    return await updateFile(getBannerID(id), file);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Update Banner Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

export const deleteProfile = async (id: string) => {
  try {
    await deleteFile(getProfileID(id));

    return {
      success: true,
    };
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Delete Profile Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

export const deleteBanner = async (id: string) => {
  try {
    await deleteFile(getBannerID(id));

    return {
      success: true,
    };
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Delete Banner Due To Server Error",
      "STORAGE_SERVER_ERROR",
    );
  }
};

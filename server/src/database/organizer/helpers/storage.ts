import { getFile, uploadFile, updateFile, deleteFile } from "@helpers/storage";

import AppwriteError, { isAppwriteError } from "@utils/AppwriteError";

import ApiError from "@utils/ApiError";

export const getProfile = async (id: string) => {
  try {
    return await getFile(`${id}_PROFILE`);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Retrieve Profile Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

export const getBanner = async (id: string) => {
  try {
    return await getFile(`${id}_BANNER`);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Retrieve Banner Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

export const uploadProfile = async (id: string, file: File) => {
  try {
    return await uploadFile(file, `${id}_PROFILE`);
  } catch (error) {
    console.log(error);

    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Upload Image Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

export const uploadBanner = async (id: string, file: File) => {
  try {
    return await uploadFile(file, `${id}_BANNER`);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Upload Banner Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

export const updateProfile = async (id: string, file: File) => {
  try {
    return await updateFile(file, `${id}_PROFILE`);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Update Profile Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

export const updateBanner = async (id: string, file: File) => {
  try {
    return await updateFile(file, `${id}_BANNER`);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Update Banner Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

export const deleteProfile = async (id: string) => {
  try {
    await deleteFile(`${id}_PROFILE`);

    return {
      success: true,
    };
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Delete Profile Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

export const deleteBanner = async (id: string) => {
  try {
    await deleteFile(`${id}_BANNER`);

    return {
      success: true,
    };
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Delete Banner Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

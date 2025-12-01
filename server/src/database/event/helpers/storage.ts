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

import AppwriteError, { isAppwriteError } from "@utils/AppwriteError";

export const getCoverID = (id: string) => {
  return `EVENT_${getID(id)}_COVER`;
};

export const getBannerID = (id: string) => {
  return `EVENT_${getID(id)}_BANNER`;
};

export const getImageID = (id: string, index: number) => {
  return `EVENT_${getID(id)}_IMAGE_${index}`;
};

export const getVideoID = (id: string, index: number) => {
  return `EVENT_${getID(id)}_VIDEO_${index}`;
};

export const getCover = async (id: string) => {
  try {
    return await getFile(getCoverID(id));
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Retrieve Event Cover Image Due To Server Error",
      "STORAGE_SERVER_ERROR"
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
      "Unable To Retrieve Event Banner Image Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

export const getImage = async (id: string, index: number) => {
  try {
    return await getFile(getImageID(id, index));
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Retrieve Event Banner Image Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

export const getImages = async (id: string) => {
  try {
    return await getFiles([
      Query.startsWith("$id", `EVENT_${getID(id)}_IMAGE_`),
    ]);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Retrieve Event Images Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

export const getVideo = async (id: string, index: number) => {
  try {
    return await getFile(getVideoID(id, index));
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Retrieve Event Banner Video Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

export const getVideos = async (id: string) => {
  try {
    return await getFiles([
      Query.startsWith("$id", `EVENT_${getID(id)}_VIDEO_`),
    ]);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Retrieve Event Videos Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

export const uploadCover = async (id: string, file: File) => {
  try {
    return await uploadFile(getCoverID(id), file);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Upload Event Cover Image Due To Server Error",
      "STORAGE_SERVER_ERROR"
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
      "Unable To Upload Event Banner Image Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

export const uploadImage = async (id: string, index: number, file: File) => {
  try {
    return await uploadFile(getImageID(id, index), file);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Upload Event Image Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

export const uploadVideo = async (id: string, index: number, file: File) => {
  try {
    return await uploadFile(getVideoID(id, index), file);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Upload Event Video Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

export const updateCover = async (id: string, file: File) => {
  try {
    return await updateFile(getCoverID(id), file);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Update Event Cover Image Due To Server Error",
      "STORAGE_SERVER_ERROR"
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
      "Unable To Update Event Banner Image Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

export const updateImage = async (id: string, index: number, file: File) => {
  try {
    return await updateFile(getImageID(id, index), file);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Update Event Image Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

export const updateVideo = async (id: string, index: number, file: File) => {
  try {
    return await updateFile(getVideoID(id, index), file);
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Update Event Video Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

export const deleteCover = async (id: string) => {
  try {
    await deleteFile(getCoverID(id));

    return {
      success: true,
    };
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Delete Event Cover Image Due To Server Error",
      "STORAGE_SERVER_ERROR"
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
      "Unable To Delete Event Banner Image Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

export const deleteImage = async (id: string, index: number) => {
  try {
    await deleteFile(getImageID(id, index));

    return {
      success: true,
    };
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Delete Event Image Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

export const deleteVideo = async (id: string, index: number) => {
  try {
    await deleteFile(getVideoID(id, index));

    return {
      success: true,
    };
  } catch (error) {
    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    throw new ApiError(
      "Unable To Delete Event Video Due To Server Error",
      "STORAGE_SERVER_ERROR"
    );
  }
};

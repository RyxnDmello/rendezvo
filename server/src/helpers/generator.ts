import { randomBytes, randomUUID } from "crypto";

export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

export const generateDeviceID = () => {
  return randomUUID().replace("-", "");
};

export const generateTokenID = (length: number = 16) => {
  return randomBytes(length).toString("hex");
};

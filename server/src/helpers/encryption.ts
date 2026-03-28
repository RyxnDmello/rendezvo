import { password } from "bun";
import { subtle } from "crypto";

export const hashToken = async (token: string) => {
  const data = new TextEncoder().encode(token);
  const hash = await subtle.digest("SHA-256", data);
  return Buffer.from(hash).toString("hex");
};

export const hashPassword = async (plain: string) => {
  return await password.hash(plain, {
    algorithm: "argon2id",
    memoryCost: 19456,
    timeCost: 2,
  });
};

export const verifyPassword = async (plain: string, encrypted: string) => {
  return await password.verify(plain, encrypted, "argon2id");
};

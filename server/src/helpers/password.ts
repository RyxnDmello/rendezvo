import { password } from "bun";

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

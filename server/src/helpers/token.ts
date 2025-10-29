import { sign, verify } from "hono/jwt";

import { SignatureAlgorithm } from "hono/utils/jwt/jwa";

export type Payload = Record<string, any>;

export const ALGORITHM: SignatureAlgorithm = "HS512";

export const createToken = async (
  data: Payload,
  secret: string,
  expiry: number
) => {
  const exp = Math.floor(Date.now() / 1000) + expiry * 60;
  return await sign({ data, exp }, secret, ALGORITHM);
};

export const verifyToken = async <T extends Payload>(
  token: string,
  secret: string
) => {
  const { data } = await verify(token, secret, ALGORITHM);
  return data ? (data as T) : null;
};

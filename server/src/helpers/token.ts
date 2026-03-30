import { sign, verify } from "hono/jwt";

import { SignatureAlgorithm } from "hono/utils/jwt/jwa";

import { getDate } from "@helpers/date";
import { generateTokenID } from "@helpers/generator";

export type Payload = {
  data: Record<string, any>;
  jti: string;
  iss: string;
  exp: number;
};

export const ALGORITHM: SignatureAlgorithm = "HS512";

export const createToken = async (
  data: Payload["data"],
  secret: string,
  issuer: string,
  expiry: number,
) => {
  const jti = generateTokenID();

  const token = await sign(
    {
      jti,
      data,
      iss: issuer,
      exp: Math.floor(getDate(expiry).getTime() / 1000),
    },
    secret,
    ALGORITHM,
  );

  return {
    jti,
    token,
  };
};

export const verifyToken = async <T extends Payload>(
  token: string,
  secret: string,
  issuer: string,
) => {
  const payload = await verify(token, secret, ALGORITHM);
  return payload && payload.iss === issuer ? (payload as T) : null;
};

import { sign, verify } from "hono/jwt";

import { SignatureAlgorithm } from "hono/utils/jwt/jwa";

import { getDate } from "@helpers/date";
import { generateTokenID } from "@helpers/generator";

/**
 * The JWT encryption algorithm. Used as HS512.
 */
export const ALGORITHM: SignatureAlgorithm = "HS512";

/**
 * A type that represents the payload of every JWT token. Must be respected.
 *
 * Every JWT token must have a unique ID, referenced as `jti`. The issuer or origin
 * of the token must be assigned, referenced as `iss`. A token can additionally store
 * some data, that can be referenced later, during verification.
 */
export type Payload = {
  data: Record<string, any>;
  jti: string;
  iss: string;
  exp: number;
};

/**
 * A helper function to create a JWT token. A token can also store some data.
 * The secret key is used for secure encryption, while issuer is used for
 * identifying the origin of the token. Every token must eventually expiry.
 *
 * @param {Payload["data"]} data - Any data to be embedded in the token.
 * @param {string} secret - The secret key for secure encryption.
 * @param {string} issuer - The issuer key to identify the origin.
 * @param {number} expiry - The expiry of the token. Must be in minutes.
 *
 * @returns The jti and token. The jti is the unique ID of the token.
 *
 * @example
 * const data = {
 *   id: "user-id",
 *   role: "user-role"
 * };
 *
 * const expiry = 15
 * const secret = "secret-key"
 * const issuer = "issuer-key"
 *
 * const token = await createToken(data, secret, issuer, expiry);
 */
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

/**
 * A helper function to verify a JWT token. If the token has been
 * encrypted with the appropriate encryption key and has been issued
 * by this server, than it will be verified.
 *
 * @param {string} token - The JWT token to be verified.
 * @param {string} secret - The secret key for secure encryption.
 * @param {string} issuer - The issuer key to identify the origin.
 *
 * @returns The token payload on successful verification. Or else null.
 *
 * @example
 * const token = "jwt-token";
 * const secret = "secret-key"
 * const issuer = "issuer-key"
 *
 * const payload = await verifyToken(data, secret, issuer, expiry);
 *
 * if (payload) {
 *   console.log("Success");
 * } else {
 *   console.log("Failure");
 * }
 */
export const verifyToken = async <T extends Payload>(
  token: string,
  secret: string,
  issuer: string,
) => {
  const payload = await verify(token, secret, ALGORITHM);
  return payload && payload.iss === issuer ? (payload as T) : null;
};

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "بطاطس";
const EXPIRES_IN = "7d";

export function createToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function decodeToken(token: string) {
  return jwt.decode(token);
}

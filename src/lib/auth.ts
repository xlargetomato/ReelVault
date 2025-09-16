import jwt from "jsonwebtoken";

export interface AuthUser {
  id: number;
  email: string;
}

export function getUserFromRequest(req: Request): AuthUser | null {
  try {
    const token = req.headers
      .get("cookie")
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) return null;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}

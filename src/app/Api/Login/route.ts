import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyPassword } from "@/lib/hash";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const secret: Secret = process.env.JWT_SECRET as string;

    const options: SignOptions = {
      expiresIn: process.env.JWT_EXPIRES_IN as number | undefined | any,
    };

    const token = jwt.sign({ id: user.id, email: user.email }, secret, options);

    const response = NextResponse.json({
      message: "Login successful",
      user: { id: user.id, email: user.email },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 127856000,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

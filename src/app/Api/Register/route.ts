import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/hash";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    return NextResponse.json({
      email,
      hashedPassword,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

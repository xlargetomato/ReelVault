import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// import { getSession } from "next-auth/react";
export async function POST(req: Request) {
  const user = getUserFromRequest(req);

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated \n CAN YOU LOGIN FIRST ?" },
      { status: 401 }
    );
  }

  try {
    const { title, link, notes, categories } = await req.json();
    if (!title || !link) {
      return NextResponse.json(
        { error: "somthing is missing from requirements" },
        { status: 400 }
      );
    }

    const existing = await prisma.reel.findFirst({
      where: { link },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Reel with this URL already exists" },
        { status: 400 }
      );
    }

    const reel = await prisma.reel.create({
      data: {
        title,
        link,
        notes,
        categories,
        userId: user.id,
      },
    });

    return NextResponse.json(reel, { status: 201 });
  } catch (err) {
    console.error("Error creating reel:", err);
    return NextResponse.json(
      { error: "Error fetching reels" },
      { status: 500 }
    );
  }
}
export async function GET(req: Request) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated \n CAN YOU LOGIN FIRST ?" },
      { status: 401 }
    );
  }
  try {
    const reels = await prisma.reel.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        title: true,
        link: true,
        notes: true,
        categories: true,
        createdAt: true,
      },
    });
    return NextResponse.json(reels, { status: 200 });
  } catch (err) {
    console.error("Error fetching reels:", err);
    return NextResponse.json(
      { error: "Error fetching reels" },
      { status: 500 }
    );
  }
}

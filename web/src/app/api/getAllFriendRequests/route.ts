"use server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userEmail = searchParams.get("userEmail");
  const session = await getServerSession();

  if (!userEmail || !session) {
    return NextResponse.json({ message: "Missing info" }, { status: 404 });
  }
  try {
    const requestsReceived = await prisma.friendship.findMany({
      where: {
        addressee: {
          email: session.user?.email as string,
        },
        status: {
          equals: "PENDING",
        },
      },
      select: {
        id: true,
        requester: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    console.log(requestsReceived);
    return NextResponse.json({
      message: "Successfully fetched all the friend requests",
      requestsReceived,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error while getting friend requests", error },
      { status: 500 }
    );
  }
}

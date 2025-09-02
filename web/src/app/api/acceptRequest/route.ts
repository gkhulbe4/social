import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { requestEmail, requestId } = await req.json();
  const session = await getServerSession();

  try {
    if (!session || !requestEmail) {
      return NextResponse.json({ message: "Missing info" }, { status: 400 });
    }

    const friendship = await prisma.friendship.findUnique({
      where: { id: requestId },
    });

    if (!friendship) {
      return NextResponse.json(
        { message: "Friend request not found" },
        { status: 404 }
      );
    }

    await prisma.friendship.update({
      where: {
        id: requestId,
      },
      data: {
        status: "ACCEPTED",
      },
    });

    await redis.publish(
      `notifications:${requestEmail}`,
      `${session.user?.email} has accepted your friend request`
    );

    return NextResponse.json(
      {
        message: "Friend request accepted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to accept friend request",
        error,
      },
      { status: 500 }
    );
  }
}

import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // make sure you export this
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const { email } = await req.json();

  try {
    if (!session?.user?.email || !email) {
      return NextResponse.json({ message: "Missing info" }, { status: 400 });
    }

    const requester = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!requester) {
      return NextResponse.json(
        { message: "Requester not found" },
        { status: 404 }
      );
    }

    const addressee = await prisma.user.findUnique({
      where: { email },
    });

    if (!addressee) {
      return NextResponse.json(
        { message: "User doesn't exist" },
        { status: 404 }
      );
    }

    if (requester.id === addressee.id) {
      return NextResponse.json(
        { message: "You cannot add yourself" },
        { status: 400 }
      );
    }

    const existingRequest = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: requester.id, addresseeId: addressee.id },
          { requesterId: addressee.id, addresseeId: requester.id },
        ],
      },
    });

    if (existingRequest?.status === "ACCEPTED") {
      return NextResponse.json(
        { message: "Already your friend" },
        { status: 400 }
      );
    }

    if (existingRequest?.status === "PENDING") {
      return NextResponse.json(
        { message: "Request already pending" },
        { status: 400 }
      );
    }

    await prisma.friendship.create({
      data: {
        requesterId: requester.id,
        addresseeId: addressee.id,
      },
    });

    await redis.publish(
      `notifications:${email}`,
      `${session.user.email} sent you a friend request`
    );

    return NextResponse.json(
      { message: `Friend request sent to ${addressee.email}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Friend request error:", error);
    return NextResponse.json(
      { message: "Failed to send friend request" },
      { status: 500 }
    );
  }
}

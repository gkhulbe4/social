import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userEmail = searchParams.get("userEmail");
  // console.log(userEmail);
  try {
    if (!userEmail) {
      return NextResponse.json({ message: "Missing Info" }, { status: 404 });
    }

    const friends = await prisma.friendship.findMany({
      where: {
        OR: [
          {
            addressee: {
              email: userEmail as string,
            },
          },
          {
            requester: {
              email: userEmail as string,
            },
          },
        ],
        status: "ACCEPTED",
      },
      select: {
        addressee: {
          select: {
            email: true,
          },
        },
        requester: {
          select: {
            email: true,
          },
        },
      },
    });

    const allFriends = friends.map((f) =>
      f.addressee.email === userEmail ? f.requester : f.addressee
    );
    return NextResponse.json(
      { message: "All friends emails", allFriends },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error in getting friends", error },
      { status: 500 }
    );
  }
}

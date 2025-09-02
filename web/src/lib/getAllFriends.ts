import { NextResponse } from "next/server";
import { prisma } from "./prisma";

export async function getAllFriends(userEmail: string) {
  try {
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
            name: true,
            email: true,
            image: true,
          },
        },
        requester: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    const allFriendsInfo = friends.map((f) =>
      f.addressee.email === userEmail ? f.requester : f.addressee
    );

    return allFriendsInfo;
  } catch (error) {
    console.log(error);
  }
}

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { currentUser, receiver } = await req.json();
  if (!currentUser || !receiver) {
    return NextResponse.json({ message: "Missing info" }, { status: 404 });
  }

  try {
    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          {
            sender: {
              email: currentUser,
            },
            receiver: {
              email: receiver,
            },
          },
          {
            sender: {
              email: receiver,
            },
            receiver: {
              email: currentUser,
            },
          },
        ],
      },
      select: {
        sender: {
          select: {
            email: true,
          },
        },
        receiver: {
          select: {
            email: true,
          },
        },
        message: true,
        // createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(
      { message: "Chats fetched successfully", chats },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error in fetching chats", error },
      { status: 500 }
    );
  }
}

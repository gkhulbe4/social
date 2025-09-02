import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { requestEmail, requestId } = await req.json();
  const session = await getServerSession();

  try {
    if (!session || !requestEmail) {
      return NextResponse.json({ message: "Missing info" }, { status: 400 });
    }

    await prisma.friendship.delete({
      where: {
        id: requestId,
      },
    });

    return NextResponse.json(
      {
        message: "Friend request rejected successfully",
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

import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { postContent } = await req.json();
  const session = await getServerSession();

  try {
    if (!session || !postContent) {
      return NextResponse.json({ message: "Missing info" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email as string,
      },
    });

    await prisma.post.create({
      data: {
        content: postContent as string,
        authorId: user?.id as string,
      },
    });

    // console.log(`friend:${session.user?.email}`);
    await redis.publish(
      `friend:${session.user?.email}`,
      `${session.user?.email} just posted!`
    );

    return NextResponse.json(
      {
        message: "Post Added",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to add post",
        error,
      },
      { status: 500 }
    );
  }
}

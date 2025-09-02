import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { likedByEmail, postId, authorId, authorEmail } = await req.json();
  if (!likedByEmail || !postId || !authorId) {
    return NextResponse.json({ message: "Missing Info" }, { status: 404 });
  }

  try {
    await redis.lpush(
      "handleLikeQueue",
      JSON.stringify({
        likedByEmail: likedByEmail,
        postId: postId,
        authorId: authorId,
        authorEmail: authorEmail,
      })
    );
    return NextResponse.json(
      { message: "Like handled successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred", error },
      { status: 500 }
    );
  }
}

import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import Likes from "./Likes";
import { prisma } from "@/lib/prisma";

async function PostCard({
  authorImg,
  authorName,
  authorEmail,
  authorId,
  createdAt,
  postId,
  postContent,
  totalLikes,
}: {
  authorImg: string | null;
  authorName: string | null;
  authorEmail: string | null;
  authorId: string;
  createdAt: Date;
  postId: string;
  postContent: string;
  totalLikes: number;
}) {
  const session = await getServerSession();

  const userLiked = await prisma.postLike.findFirst({
    where: {
      postId: postId,
      user: {
        email: session?.user?.email as string,
      },
    },
  });
  // console.log(userLiked);

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-5 flex gap-4 hover:shadow-md transition">
      <Link
        href={
          session?.user?.email == authorEmail
            ? `/profile`
            : `/profile/${authorEmail?.split("@")[0]}`
        }
      >
        <img
          src={authorImg!}
          alt={authorEmail!}
          className="w-12 h-12 rounded-full border"
        />
      </Link>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href={
                session?.user?.email == authorEmail
                  ? `/profile`
                  : `/profile/${authorEmail?.split("@")[0]}`
              }
              className="font-semibold text-gray-900"
            >
              {authorName}
            </Link>
            <p className="text-sm text-gray-500">{authorEmail}</p>
          </div>
          <p className="text-xs text-gray-400">
            {new Date(createdAt).toLocaleString()}
          </p>
        </div>

        <p className="mt-3 text-gray-700 font-bold text-sm">
          {postContent || "This is a sample post content..."}
        </p>

        <Likes
          currentUserEmail={session?.user?.email as string}
          authorId={authorId}
          authorEmail={authorEmail}
          postId={postId}
          totalLikes={totalLikes}
          userHasLiked={userLiked ? true : false}
        />
      </div>
    </div>
  );
}

export default PostCard;

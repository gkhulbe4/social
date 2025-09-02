import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export async function handleLike(
  likedByEmail: string,
  postId: string,
  authorEmail: string
) {
  try {
    const likedByUser = await prisma.user.findUnique({
      where: {
        email: likedByEmail,
      },
    });

    if (!likedByUser) {
      return;
    }

    const checkLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          postId: postId,
          userId: likedByUser?.id,
        },
      },
    });

    if (checkLike) {
      await prisma.postLike.delete({
        where: {
          userId_postId: {
            postId: postId,
            userId: likedByUser?.id,
          },
        },
      });
    } else {
      await prisma.postLike.create({
        data: {
          postId: postId,
          userId: likedByUser.id,
        },
      });
      if (authorEmail != likedByEmail) {
        await redis.publish(
          `notifications:${authorEmail}`,
          `${likedByUser.email} liked your post!`
        );
      }
    }
  } catch (error) {
    console.log("Error in handling like", error);
  }
}

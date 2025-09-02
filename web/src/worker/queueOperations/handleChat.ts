import { prisma } from "@/lib/prisma";

export async function handleChat(
  from: string,
  to: string,
  message: string,
  createdAt: string
) {
  try {
    const fromUser = await prisma.user.findUnique({
      where: {
        email: from,
      },
    });
    if (!fromUser) {
      throw new Error("From user email not found");
    }

    const toUser = await prisma.user.findUnique({
      where: {
        email: to,
      },
    });
    if (!toUser) {
      throw new Error("To user email not found");
    }

    await prisma.chat.create({
      data: {
        message: message,
        receiverId: toUser.id,
        senderId: fromUser.id,
        createdAt: new Date(createdAt),
      },
    });
  } catch (error) {
    console.log("Error in creating chat", error);
  }
}

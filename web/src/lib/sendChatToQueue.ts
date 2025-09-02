"use server";
import { redis } from "./redis";

export async function sendChatToQueue(
  from: string,
  to: string,
  message: string,
  createdAt: Date
) {
  //   console.log("i am here", { from, to, message });
  try {
    await redis.lpush(
      "chatQueue",
      JSON.stringify({
        from: from,
        to: to,
        message: message,
        createdAt: createdAt,
      })
    );
  } catch (error) {
    console.log("Error in chatQueue", error);
  }
}

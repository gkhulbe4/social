"use server";
import { getConversationId } from "./getConversationId";
import { redis } from "./redis";

export async function getChatsFromCache(
  currentUserEmail: string,
  receiver: string
) {
  const convoId = getConversationId(currentUserEmail, receiver);
  console.log(convoId);
  const res = await redis.lrange(`chat:${convoId}`, 0, -1);
  //   console.log("Cached chats: ", res);
  const data = res.map((chat) => JSON.parse(chat));
  // need to reverse so that i can get the latest one first
  return data.reverse();
}

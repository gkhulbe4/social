import { redis } from "@/lib/redis";
import sendEmail from "@/lib/sendMail";
import { handleLike } from "./queueOperations/handleLike";
import { handleChat } from "./queueOperations/handleChat";

async function startWorker() {
  console.log("Worker started");

  while (true) {
    const res = await redis.brpop(
      ["emailQueue", "handleLikeQueue", "chatQueue"],
      5000
    );
    if (res) {
      const [queue, message] = res;
      const data = JSON.parse(message);

      if (queue == "emailQueue") {
        sendEmail(data);
        // console.log(res);
      } else if (queue == "handleLikeQueue") {
        await handleLike(data.likedByEmail, data.postId, data.authorEmail);
      } else if (queue == "chatQueue") {
        await handleChat(data.from, data.to, data.message, data.createdAt);
      }
    }
  }
}

startWorker();

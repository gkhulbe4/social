import Redis from "ioredis";
import { WebSocket } from "ws";
import { UserManager } from "./UserManager";
import { getConversationId } from "./lib/getConversationId";

export class SubscriptionManager {
  private static instance: SubscriptionManager;
  private subscriptions = new Map<string, string[]>(); // userId -> subs[]
  private reverseSubscriptions = new Map<string, string[]>(); // subs -> userId[]
  private subscriber: Redis;
  private publisher: Redis;

  private constructor() {
    this.subscriber = new Redis();
    this.publisher = new Redis();
    this.onListenEvents();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new SubscriptionManager();
    return this.instance;
  }

  subscribe(userEmail: string, subscription: string) {
    let userSubs = this.subscriptions.get(userEmail);
    if (!userSubs) {
      userSubs = [];
    }

    let subscriptionUsers = this.reverseSubscriptions.get(subscription);
    if (!subscriptionUsers) {
      subscriptionUsers = [];
    }

    if (userSubs?.includes(subscription)) return;

    userSubs?.push(subscription);
    subscriptionUsers?.push(userEmail);

    this.subscriber.subscribe(subscription);
  }

  publish(
    userEmail: string,
    userEmailFrom: string,
    notification: string,
    message?: string,
    createdAt?: Date
  ) {
    this.publisher.publish(
      `chat:${userEmail}`,
      JSON.stringify({
        notification,
        message,
        createdAt,
        users: {
          from: userEmailFrom,
          to: userEmail,
        },
      })
    );
  }

  onListenEvents() {
    this.subscriber.on("message", async (channel: string, message: string) => {
      const users = UserManager.getInstance().getAllUser();
      console.log(message);
      console.log(channel);
      if (channel == "ADMIN-MESSAGE") {
        users.forEach((user) => {
          user.ws.send(
            JSON.stringify({ type: "ADMIN-MESSAGE", message: message })
          );
        });
      } else if (channel.startsWith("notifications:")) {
        const userEmail = channel.split("notifications:")[1];
        const findUser = users.get(userEmail as string);
        findUser?.ws.send(
          JSON.stringify({ type: "notification", message: message })
        );
      } else if (channel.startsWith("friend")) {
        console.log("i am in friends publish");
        const userEmail = channel.split("friend:")[1];
        const res = await fetch(
          `http://localhost:3000/api/getAllFriends/?userEmail=${userEmail}`
        );
        const data = await res.json();
        data.allFriends.forEach((friend: { email: string }) => {
          const user = users.get(friend.email as string);
          user?.ws.send(JSON.stringify({ type: "friend", message: message }));
        });
      } else if (channel.startsWith("chat")) {
        const parsedMessage = JSON.parse(message);
        const userEmail = channel.split("chat:")[1];
        const findUser = users.get(userEmail as string);

        // get conversation id
        const convoId = getConversationId(
          parsedMessage.users.from,
          parsedMessage.users.to
        );

        // pushing to sender and receiver
        this.publisher.lpush(
          `chat:${convoId}`,
          JSON.stringify({
            sender: {
              email: parsedMessage.users.from,
            },
            receiver: {
              email: parsedMessage.users.to,
            },
            message: parsedMessage.message,
            createdAt: parsedMessage.createdAt,
          })
        );

        //trimming to latest 100 messages
        this.publisher.ltrim(
          `chat:${parsedMessage.users.from}:${parsedMessage.users.to}`,
          0,
          50
        );

        //sending to receiver's ws
        findUser?.ws.send(
          JSON.stringify({
            type: "chat",
            message: parsedMessage.message,
            notification: parsedMessage.notification,
            from: parsedMessage.users.from,
            to: parsedMessage.users.to,
            createdAt: parsedMessage.createdAt,
          })
        );
      }
    });
  }
}

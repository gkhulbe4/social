import { WebSocket } from "ws";
import { UserManager } from "./UserManager";
import { SubscriptionManager } from "./SubscriptionManager";

export class User {
  static instance: User;
  private userEmail: string;
  ws: WebSocket;

  constructor(ws: WebSocket, userEmail: string) {
    this.userEmail = userEmail;
    this.ws = ws;
    SubscriptionManager.getInstance().subscribe(userEmail, "ADMIN-MESSAGE");
    SubscriptionManager.getInstance().subscribe(
      userEmail,
      `notifications:${userEmail}`
    );
    SubscriptionManager.getInstance().subscribe(userEmail, `chat:${userEmail}`);
    this.subscribeToFriends(this.userEmail);
    this.onListener();
  }

  async subscribeToFriends(userEmail: string) {
    const res = await fetch(
      `http://localhost:3000/api/getAllFriends/?userEmail=${userEmail}`
    );
    const data = await res.json();
    data.allFriends.forEach((friend: { email: string }) => {
      SubscriptionManager.getInstance().subscribe(
        this.userEmail,
        `friend:${friend.email}`
      );
    });
  }

  // listen to publish
  onListener() {
    this.ws.on("message", (data) => {
      const parsedData = JSON.parse(data as unknown as string);
      console.log(parsedData);

      if (parsedData.type === "SUBSCRIBE") {
        if (parsedData.subType == "friend") {
          const { user1Email, user2Email } = parsedData.users;
          SubscriptionManager.getInstance().subscribe(
            user1Email,
            `friend:${user2Email}`
          );
          SubscriptionManager.getInstance().subscribe(
            user2Email,
            `friend:${user1Email}`
          );
        }
      } else if (parsedData.type == "chat") {
        SubscriptionManager.getInstance().publish(
          parsedData.data.users.to,
          parsedData.data.users.from,
          `${parsedData.data.users.from} sent you a message!`,
          parsedData.data.message,
          parsedData.data.createdAt
        );
      }
    });
  }
}

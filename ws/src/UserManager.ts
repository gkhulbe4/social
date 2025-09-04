import { WebSocket } from "ws";
import { User } from "./User";

// users = {
//     userId : {
//         ws:[],
//         userId
//     }
// }

export class UserManager {
  private static instance: UserManager;
  private users = new Map<string, User>();

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new UserManager();
    return this.instance;
  }

  addUser(ws: WebSocket, userEmail: string) {
    const user = new User(ws, userEmail);
    this.users.set(userEmail, user);
    // console.log("Added the user");
    this.onUserDisconnect(ws, userEmail);
  }

  onUserDisconnect(ws: WebSocket, userEmail: string) {
    ws.on("close", () => {
      const user = this.users.get(userEmail);
      if (!user) return;
      const userConnections = user?.ws;
      const newConnections = userConnections?.filter((conn) => conn != ws);

      if (newConnections?.length == 0) {
        this.users.delete(userEmail);
        console.log(`${userEmail} disconnected`);
      } else {
        user.ws = newConnections;
      }
    });
  }

  public getAllUser() {
    return this.users;
  }
}

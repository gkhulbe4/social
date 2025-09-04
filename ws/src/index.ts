import { WebSocketServer, WebSocket } from "ws";
import { UserManager } from "./UserManager";
import { User } from "./User";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws: WebSocket, request) => {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const userEmail = queryParams.get("userEmail") as string;

  if (!userEmail) {
    ws.close();
    return;
  }

  console.log(`${userEmail} connected`);
  const users = UserManager.getInstance().getAllUser();
  if (users.has(userEmail)) {
    const user = users.get(userEmail);
    user?.ws.push(ws);
    user?.onListener(ws);
  } else {
    UserManager.getInstance().addUser(ws, userEmail);
  }
});

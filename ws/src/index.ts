import { WebSocketServer, WebSocket } from "ws";
import { UserManager } from "./UserManager";

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
  UserManager.getInstance().addUser(ws, userEmail);
});

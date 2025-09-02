"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const UserManager_1 = require("./UserManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on("connection", (ws, request) => {
    const url = request.url;
    if (!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const userEmail = queryParams.get("userEmail");
    if (!userEmail) {
        ws.close();
        return;
    }
    console.log(`${userEmail} connected`);
    UserManager_1.UserManager.getInstance().addUser(ws, userEmail);
});
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const SubscriptionManager_1 = require("./SubscriptionManager");
class User {
    static instance;
    userEmail;
    ws;
    constructor(ws, userEmail) {
        this.userEmail = userEmail;
        this.ws = ws;
        SubscriptionManager_1.SubscriptionManager.getInstance().subscribe(userEmail, "ADMIN-MESSAGE");
        SubscriptionManager_1.SubscriptionManager.getInstance().subscribe(userEmail, `notifications:${userEmail}`);
        SubscriptionManager_1.SubscriptionManager.getInstance().subscribe(userEmail, `chat:${userEmail}`);
        this.subscribeToFriends(this.userEmail);
        this.onListener();
    }
    async subscribeToFriends(userEmail) {
        const res = await fetch(`http://localhost:3000/api/getAllFriends/?userEmail=${userEmail}`);
        const data = await res.json();
        data.allFriends.forEach((friend) => {
            SubscriptionManager_1.SubscriptionManager.getInstance().subscribe(this.userEmail, `friend:${friend.email}`);
        });
    }
    // listen to publish
    onListener() {
        this.ws.on("message", (data) => {
            const parsedData = JSON.parse(data);
            console.log(parsedData);
            if (parsedData.type === "SUBSCRIBE") {
                if (parsedData.subType == "friend") {
                    const { user1Email, user2Email } = parsedData.users;
                    SubscriptionManager_1.SubscriptionManager.getInstance().subscribe(user1Email, `friend:${user2Email}`);
                    SubscriptionManager_1.SubscriptionManager.getInstance().subscribe(user2Email, `friend:${user1Email}`);
                }
            }
            else if (parsedData.type == "chat") {
                SubscriptionManager_1.SubscriptionManager.getInstance().publish(parsedData.data.users.to, parsedData.data.users.from, `${parsedData.data.users.from} sent you a message!`, parsedData.data.message, parsedData.data.createdAt);
            }
        });
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionManager = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const UserManager_1 = require("./UserManager");
const getConversationId_1 = require("./lib/getConversationId");
class SubscriptionManager {
    static instance;
    subscriptions = new Map(); // userId -> subs[]
    reverseSubscriptions = new Map(); // subs -> userId[]
    subscriber;
    publisher;
    constructor() {
        this.subscriber = new ioredis_1.default();
        this.publisher = new ioredis_1.default();
        this.onListenEvents();
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new SubscriptionManager();
        return this.instance;
    }
    subscribe(userEmail, subscription) {
        let userSubs = this.subscriptions.get(userEmail);
        if (!userSubs) {
            userSubs = [];
        }
        let subscriptionUsers = this.reverseSubscriptions.get(subscription);
        if (!subscriptionUsers) {
            subscriptionUsers = [];
        }
        if (userSubs?.includes(subscription))
            return;
        userSubs?.push(subscription);
        subscriptionUsers?.push(userEmail);
        this.subscriber.subscribe(subscription);
    }
    publish(userEmail, userEmailFrom, notification, message, createdAt) {
        this.publisher.publish(`chat:${userEmail}`, JSON.stringify({
            notification,
            message,
            createdAt,
            users: {
                from: userEmailFrom,
                to: userEmail,
            },
        }));
    }
    onListenEvents() {
        this.subscriber.on("message", async (channel, message) => {
            const users = UserManager_1.UserManager.getInstance().getAllUser();
            console.log(message);
            console.log(channel);
            if (channel == "ADMIN-MESSAGE") {
                users.forEach((user) => {
                    user.ws.send(JSON.stringify({ type: "ADMIN-MESSAGE", message: message }));
                });
            }
            else if (channel.startsWith("notifications:")) {
                const userEmail = channel.split("notifications:")[1];
                const findUser = users.get(userEmail);
                findUser?.ws.send(JSON.stringify({ type: "notification", message: message }));
            }
            else if (channel.startsWith("friend")) {
                console.log("i am in friends publish");
                const userEmail = channel.split("friend:")[1];
                const res = await fetch(`http://localhost:3000/api/getAllFriends/?userEmail=${userEmail}`);
                const data = await res.json();
                data.allFriends.forEach((friend) => {
                    const user = users.get(friend.email);
                    user?.ws.send(JSON.stringify({ type: "friend", message: message }));
                });
            }
            else if (channel.startsWith("chat")) {
                const parsedMessage = JSON.parse(message);
                const userEmail = channel.split("chat:")[1];
                const findUser = users.get(userEmail);
                // get conversation id
                const convoId = (0, getConversationId_1.getConversationId)(parsedMessage.users.from, parsedMessage.users.to);
                // pushing to sender and receiver
                this.publisher.lpush(`chat:${convoId}`, JSON.stringify({
                    sender: {
                        email: parsedMessage.users.from,
                    },
                    receiver: {
                        email: parsedMessage.users.to,
                    },
                    message: parsedMessage.message,
                    createdAt: parsedMessage.createdAt,
                }));
                //trimming to latest 100 messages
                this.publisher.ltrim(`chat:${parsedMessage.users.from}:${parsedMessage.users.to}`, 0, 50);
                //sending to receiver's ws
                findUser?.ws.send(JSON.stringify({
                    type: "chat",
                    message: parsedMessage.message,
                    notification: parsedMessage.notification,
                    from: parsedMessage.users.from,
                    to: parsedMessage.users.to,
                    createdAt: parsedMessage.createdAt,
                }));
            }
        });
    }
}
exports.SubscriptionManager = SubscriptionManager;
//# sourceMappingURL=SubscriptionManager.js.map
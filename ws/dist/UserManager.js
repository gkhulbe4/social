"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const User_1 = require("./User");
// users = {
//     userId : {
//         ws,
//         userId
//     }
// }
class UserManager {
    static instance;
    users = new Map();
    constructor() { }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new UserManager();
        return this.instance;
    }
    addUser(ws, userEmail) {
        const user = new User_1.User(ws, userEmail);
        this.users.set(userEmail, user);
        // console.log("Added the user");
        this.onUserDisconnect(ws, userEmail);
    }
    onUserDisconnect(ws, userEmail) {
        ws.on("close", () => {
            this.users.delete(userEmail);
            console.log(`${userEmail} disconnected`);
        });
    }
    getAllUser() {
        return this.users;
    }
}
exports.UserManager = UserManager;
//# sourceMappingURL=UserManager.js.map
import { WebSocket } from "ws";
import { User } from "./User";
export declare class UserManager {
    private static instance;
    private users;
    private constructor();
    static getInstance(): UserManager;
    addUser(ws: WebSocket, userEmail: string): void;
    onUserDisconnect(ws: WebSocket, userEmail: string): void;
    getAllUser(): Map<string, User>;
}
//# sourceMappingURL=UserManager.d.ts.map
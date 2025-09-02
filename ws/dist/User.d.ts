import { WebSocket } from "ws";
export declare class User {
    static instance: User;
    private userEmail;
    ws: WebSocket;
    constructor(ws: WebSocket, userEmail: string);
    subscribeToFriends(userEmail: string): Promise<void>;
    onListener(): void;
}
//# sourceMappingURL=User.d.ts.map
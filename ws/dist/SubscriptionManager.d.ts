export declare class SubscriptionManager {
    private static instance;
    private subscriptions;
    private reverseSubscriptions;
    private subscriber;
    private publisher;
    private constructor();
    static getInstance(): SubscriptionManager;
    subscribe(userEmail: string, subscription: string): void;
    publish(userEmail: string, userEmailFrom: string, notification: string, message?: string, createdAt?: Date): void;
    onListenEvents(): void;
}
//# sourceMappingURL=SubscriptionManager.d.ts.map
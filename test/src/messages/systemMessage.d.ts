export declare enum SystemMessageType {
    ActionSent = 0,
    EventPublished = 1,
    ActionHandled = 2,
    EventHandled = 3,
    ActionErred = 4,
    EventErred = 5,
}
export declare class MessageStatusData {
    messageId: string;
    error: Error;
    constructor(messageId: string, error?: Error);
}

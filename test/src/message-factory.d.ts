import { Action, Event } from "./messages/message";
import { MessageContract } from "./messages/message-contract";
import { SystemMessageType, MessageStatusData } from "./messages/systemMessage";
export interface IMessageFactory {
    CreateAction<T>(actionContract: MessageContract<T>): Action<T>;
    CreateEvent<T>(eventContract: MessageContract<T>): Event<T>;
    CreateSystemEvent(type: SystemMessageType, data: MessageStatusData): Event<MessageStatusData>;
}
export declare class MessageFactory implements IMessageFactory {
    CreateAction<T>(actionContract: MessageContract<T>): Action<T>;
    CreateEvent<T>(eventContract: MessageContract<T>): Event<T>;
    CreateSystemEvent(type: SystemMessageType, data: MessageStatusData): Event<MessageStatusData>;
}
export declare class DataWithIdMessageFactory implements IMessageFactory {
    idProperty: string;
    constructor(idProperty?: string);
    CreateAction<T>(actionContract: MessageContract<T>): Action<T>;
    CreateEvent<T>(eventContract: MessageContract<T>): Event<T>;
    CreateSystemEvent(type: SystemMessageType, data: MessageStatusData): Event<MessageStatusData>;
}

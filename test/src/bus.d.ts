import { IEmitter } from "./emitter";
import { IStore } from "./store";
import { ILogger } from "./logger";
import { IMessageFactory } from "./message-factory";
import { MessageContract } from "./messages/message-contract";
import { Action, Event } from "./messages/message";
import { ActionCallback, EventCallback } from "./messages/callbacks";
export interface IBus {
    readonly lastAction: Action<any>;
    readonly lastEvent: Event<any>;
    receive(type: string, callback: ActionCallback): void;
    unreceive(type: string, callback: ActionCallback): void;
    send<T>(action: MessageContract<T>): void;
    createAndSend(type: string, data: any): void;
    subscribe(type: string, callback: EventCallback): void;
    unsubscribe(type: string, callback: EventCallback): void;
    publish<T>(event: MessageContract<T>): void;
    createAndPublish(type: string, data: any): void;
}
export declare class Bus implements IBus {
    private readonly _messageFactory;
    private readonly _emitter;
    private readonly _store;
    private readonly _logger;
    constructor(_messageFactory: IMessageFactory, _emitter: IEmitter, _store: IStore, _logger: ILogger);
    readonly lastAction: Action<any>;
    readonly lastEvent: Event<any>;
    receive(type: string, receiver: ActionCallback): void;
    unreceive(type: string, receiver: ActionCallback): void;
    send<T>(actionContract: MessageContract<T>): void;
    createAndSend(type: string, data: any): void;
    subscribe(type: string, subscriber: EventCallback): void;
    unsubscribe(type: string, subscriber: EventCallback): void;
    publish<T>(eventContract: MessageContract<T>): void;
    createAndPublish(type: string, data: any): void;
    private _emitSystemMessage(type, originalMessageId, error?);
}

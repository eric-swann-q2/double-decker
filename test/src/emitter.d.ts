import { ILogger } from "./logger";
import { Action, Event } from "./messages/message";
import { ActionCallback, EventCallback } from "./messages/callbacks";
export interface IEmitter {
    readonly lastAction: Action<any>;
    readonly lastEvent: Event<any>;
    addReceiver(type: string, receiver: ActionCallback): void;
    removeReceiver(type: string, receiver: ActionCallback): void;
    emitAction(action: Action<any>): Promise<any>;
    addSubscriber(type: string, subscriber: EventCallback): void;
    removeSubscriber(type: string, subscriber: EventCallback): void;
    emitEvent(event: Event<any>): Promise<any>;
}
export declare class Emitter implements IEmitter {
    private _logger;
    private _receiverStore;
    private _subscriberStore;
    private _lastAction;
    private _lastEvent;
    readonly lastAction: Action<any>;
    readonly lastEvent: Event<any>;
    constructor(_logger: ILogger);
    addReceiver(type: string, receiver: ActionCallback): void;
    removeReceiver(type: string, receiver: ActionCallback): void;
    getReceiver(type: string): ActionCallback;
    emitAction(action: Action<any>): Promise<any>;
    addSubscriber(type: string, subscriber: EventCallback): void;
    removeSubscriber(type: string, subscriber: EventCallback): void;
    getSubscribers(type: string): EventCallback[];
    emitEvent(event: Event<any>): Promise<any>;
    private _throwError(errorMessage);
}

declare module "logger" {
    export interface ILogger {
        log(level: string, ...args: any[]): void;
        error(...args: any[]): void;
        warn(...args: any[]): void;
        info(...args: any[]): void;
        debug(...args: any[]): void;
    }
    export class ConsoleLogger implements ILogger {
        log(level: string, ...args: any[]): void;
        error(...args: any[]): void;
        warn(...args: any[]): void;
        info(...args: any[]): void;
        debug(...args: any[]): void;
    }
}
declare module "messages/category" {
    export enum Category {
        Action = 0,
        Event = 1,
    }
}
declare module "messages/behavior" {
    export class Behavior {
        mustPlay: boolean;
        playable: boolean;
    }
}
declare module "messages/message" {
    import { Category } from "messages/category";
    import { Behavior } from "messages/behavior";
    export class Message<T> {
        readonly id: string;
        readonly category: Category;
        readonly type: string;
        readonly data: T;
        readonly timestamp: Date;
        readonly behavior: any;
        constructor(id: string, category: Category, type: string, data: T, timestamp: Date, behavior: any);
    }
    export class Action<T> extends Message<T> {
        constructor(id: string, type: string, data: T, timestamp: Date, behavior?: Behavior);
    }
    export class Event<T> extends Message<T> {
        constructor(id: string, type: string, data: T, timestamp: Date, behavior?: Behavior);
        actionId: string;
    }
}
declare module "messages/callbacks" {
    import { Action, Event } from "messages/message";
    export type ActionCallback = (action: Action<any>) => any;
    export type EventCallback = (event: Event<any>) => any;
}
declare module "emitter" {
    import { ILogger } from "logger";
    import { Action, Event } from "messages/message";
    import { ActionCallback, EventCallback } from "messages/callbacks";
    export interface IEmitter {
        readonly lastAction: Action<any>;
        readonly lastEvent: Event<any>;
        addReceiver(type: string, receiver: ActionCallback): void;
        removeReceiver(type: string, receiver: ActionCallback): void;
        emitAction(action: Action<any>): Promise<any>;
        addSubscriber(type: string, subscriber: EventCallback): void;
        removeSubscriber(type: string, subscriber: EventCallback): void;
        emitEvent(event: Event<any>): Array<Promise<any>>;
    }
    export class Emitter implements IEmitter {
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
        emitEvent(event: Event<any>): Array<Promise<any>>;
        private _throwError(errorMessage);
    }
}
declare module "store" {
    import { Action, Event } from "messages/message";
    export interface IStore {
        readonly actions: Array<Action<any>>;
        readonly events: Array<Event<any>>;
        addAction(action: Action<any>): void;
        addEvent(event: Event<any>): void;
        clearActions(): void;
        clearEvents(): void;
    }
    export class MemoryStore implements IStore {
        readonly actions: Action<any>[];
        readonly events: Event<any>[];
        addAction(action: Action<any>): void;
        addEvent(event: Event<any>): void;
        clearActions(): void;
        clearEvents(): void;
    }
}
declare module "push-id" {
    export function createId(): string;
}
declare module "messages/message-contract" {
    import { Behavior } from "messages/behavior";
    export class MessageContract<T> {
        readonly type: string;
        readonly data: T;
        readonly behavior: Behavior;
        constructor(type: string, data: T, behavior?: Behavior);
    }
}
declare module "message-factory" {
    import { Action, Event } from "messages/message";
    import { MessageContract } from "messages/message-contract";
    export interface IMessageFactory {
        CreateAction<T>(actionContract: MessageContract<T>): Action<T>;
        CreateEvent<T>(eventContract: MessageContract<T>): Event<T>;
    }
    export class MessageFactory implements IMessageFactory {
        CreateAction<T>(actionContract: MessageContract<T>): Action<T>;
        CreateEvent<T>(eventContract: MessageContract<T>): Event<T>;
    }
    export class DataWithIdMessageFactory {
        idProperty: string;
        constructor(idProperty?: string);
        CreateAction<T>(actionContract: MessageContract<T>): Action<T>;
        CreateEvent<T>(eventContract: MessageContract<T>): Event<T>;
    }
}
declare module "bus" {
    import { IEmitter } from "emitter";
    import { IStore } from "store";
    import { ILogger } from "logger";
    import { IMessageFactory } from "message-factory";
    import { MessageContract } from "messages/message-contract";
    import { Action, Event } from "messages/message";
    import { ActionCallback, EventCallback } from "messages/callbacks";
    export interface IBus {
        readonly lastAction: Action<any>;
        readonly lastEvent: Event<any>;
        receive(type: string, callback: ActionCallback): void;
        unreceive(type: string, callback: ActionCallback): void;
        send<T>(action: MessageContract<T>): Promise<any>;
        createAndSend(type: string, data: any): Promise<any>;
        subscribe(type: string, callback: EventCallback): void;
        unsubscribe(type: string, callback: EventCallback): void;
        publish<T>(event: MessageContract<T>): Array<Promise<any>>;
        createAndPublish(type: string, data: any): Array<Promise<any>>;
    }
    export class Bus implements IBus {
        private readonly _messageFactory;
        private readonly _emitter;
        private readonly _store;
        private readonly _logger;
        constructor(_messageFactory: IMessageFactory, _emitter: IEmitter, _store: IStore, _logger: ILogger);
        readonly lastAction: Action<any>;
        readonly lastEvent: Event<any>;
        receive(type: string, receiver: ActionCallback): void;
        unreceive(type: string, receiver: ActionCallback): void;
        send<T>(actionContract: MessageContract<T>): Promise<any>;
        createAndSend(type: string, data: any): Promise<any>;
        subscribe(type: string, subscriber: EventCallback): void;
        unsubscribe(type: string, subscriber: EventCallback): void;
        publish<T>(eventContract: MessageContract<T>): Array<Promise<any>>;
        createAndPublish(type: string, data: any): Array<Promise<any>>;
    }
}
declare module "player" {
    import { IEmitter } from "emitter";
    import { ILogger } from "logger";
    import { Category } from "messages/category";
    import { IStore } from "store";
    import { Action, Event, Message } from "messages/message";
    export interface IPlayer<TMessage extends Message<any>> {
        readonly messages: TMessage[];
        readonly next: TMessage;
        readonly previous: TMessage;
        setHead(position: number): void;
        setHeadById(messageId: string): void;
        play(length: number): Array<Promise<any>>;
        playNext(): Promise<any>;
        clear(): void;
    }
    export interface IActionPlayer extends IPlayer<Action<any>> {
    }
    export interface IEventPlayer extends IPlayer<Event<any>> {
    }
    export abstract class Player<TMessage extends Message<any>> implements IPlayer<TMessage> {
        private _logger;
        constructor(_logger: ILogger);
        readonly abstract messages: TMessage[];
        protected _headPosition: number;
        protected readonly abstract _category: Category;
        readonly next: TMessage;
        readonly previous: TMessage;
        setHead(position: number): void;
        setHeadById(messageId: string): void;
        playNext(): Promise<any>;
        play(length: number): Array<Promise<any>>;
        clear(): void;
        protected abstract _clearMessages(): void;
        protected abstract _playNext(): Promise<any>;
        protected _throwError(errorMessage: string): void;
    }
    export class ActionPlayer extends Player<Action<any>> implements IActionPlayer {
        private readonly _emitter;
        private readonly _store;
        private readonly logger;
        constructor(_emitter: IEmitter, _store: IStore, logger: ILogger);
        readonly messages: Action<any>[];
        protected readonly _category: Category;
        protected _playNext(): Promise<any>;
        protected _clearMessages(): void;
    }
    export class EventPlayer extends Player<Event<any>> implements IEventPlayer {
        private readonly _emitter;
        private readonly _store;
        private readonly logger;
        constructor(_emitter: IEmitter, _store: IStore, logger: ILogger);
        readonly messages: Event<any>[];
        protected readonly _category: Category;
        protected _playNext(): Promise<any>;
        protected _clearMessages(): void;
    }
}
declare module "hub" {
    import { IActionPlayer, IEventPlayer } from "player";
    import { IBus } from "bus";
    export interface IHub {
        readonly bus: IBus;
        readonly actionPlayer: IActionPlayer;
        readonly eventPlayer: IEventPlayer;
    }
    export class Hub {
        readonly bus: IBus;
        readonly actionPlayer: IActionPlayer;
        readonly eventPlayer: IEventPlayer;
        constructor(bus: IBus, actionPlayer: IActionPlayer, eventPlayer: IEventPlayer);
    }
}
declare module "index" {
    export * from "messages/category";
    export * from "messages/callbacks";
    export * from "messages/message";
    export * from "messages/message-contract";
    export * from "messages/behavior";
    export * from "message-factory";
    export * from "emitter";
    export * from "logger";
    export * from "bus";
    export * from "player";
    export * from "store";
    export * from "hub";
}

import { IEmitter } from "./emitter";
import { ILogger } from "./logger";
import { Category } from "./messages/category";
import { IStore } from "./store";
import { Action, Event, Message } from "./messages/message";
import { MessageStatusData } from "./messages/systemMessage";
export interface IPlayer<TMessage extends Message<any>> {
    readonly messages: TMessage[];
    readonly systemEvents: Array<Event<MessageStatusData>>;
    readonly next: TMessage;
    readonly previous: TMessage;
    setHead(position: number): void;
    setHeadById(messageId: string): void;
    play(length: number): void;
    playNext(): void;
    clear(): void;
}
export interface IActionPlayer extends IPlayer<Action<any>> {
}
export interface IEventPlayer extends IPlayer<Event<any>> {
}
export declare abstract class Player<TMessage extends Message<any>> implements IPlayer<TMessage> {
    protected _store: IStore;
    private _logger;
    constructor(_store: IStore, _logger: ILogger);
    readonly abstract messages: TMessage[];
    protected _headPosition: number;
    protected readonly abstract _category: Category;
    readonly systemEvents: Array<Event<MessageStatusData>>;
    readonly next: TMessage;
    readonly previous: TMessage;
    setHead(position: number): void;
    setHeadById(messageId: string): void;
    playNext(): void;
    play(length: number): void;
    clear(): void;
    protected abstract _clearMessages(): void;
    protected abstract _playNext(next: TMessage): void;
    protected _throwError(errorMessage: string): void;
}
export declare class ActionPlayer extends Player<Action<any>> implements IActionPlayer {
    private readonly _emitter;
    private readonly logger;
    constructor(_emitter: IEmitter, store: IStore, logger: ILogger);
    readonly messages: Action<any>[];
    protected readonly _category: Category;
    protected _playNext(next: Action<any>): void;
    protected _clearMessages(): void;
}
export declare class EventPlayer extends Player<Event<any>> implements IEventPlayer {
    private readonly _emitter;
    private readonly logger;
    constructor(_emitter: IEmitter, store: IStore, logger: ILogger);
    readonly messages: Event<any>[];
    protected readonly _category: Category;
    protected _playNext(next: Event<any>): void;
    protected _clearMessages(): void;
}

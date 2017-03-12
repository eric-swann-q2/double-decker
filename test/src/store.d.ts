import { Action, Event } from "./messages/message";
import { MessageStatusData } from "./messages/systemMessage";
export interface IStore {
    readonly actions: Array<Action<any>>;
    readonly events: Array<Event<any>>;
    readonly systemEvents: Array<Event<MessageStatusData>>;
    addAction(action: Action<any>): void;
    addEvent(event: Event<any>): void;
    addSystemEvent(event: Event<MessageStatusData>): void;
    clearActions(): void;
    clearEvents(): void;
}
export declare class MemoryStore implements IStore {
    readonly actions: Action<any>[];
    readonly events: Event<any>[];
    readonly systemEvents: Event<MessageStatusData>[];
    addAction(action: Action<any>): void;
    addEvent(event: Event<any>): void;
    addSystemEvent(event: Event<MessageStatusData>): void;
    clearActions(): void;
    clearEvents(): void;
}

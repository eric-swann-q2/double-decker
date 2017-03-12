import { Category } from "./category";
import { Behavior } from "./behavior";
export declare class Message<T> {
    readonly id: string;
    readonly category: Category;
    readonly type: string;
    readonly data: T;
    readonly timestamp: Date;
    readonly behavior: Behavior;
    constructor(id: string, category: Category, type: string, data: T, timestamp: Date, behavior: Behavior);
}
export declare class Action<T> extends Message<T> {
    constructor(id: string, type: string, data: T, timestamp: Date, behavior?: Behavior);
}
export declare class Event<T> extends Message<T> {
    constructor(id: string, type: string, data: T, timestamp: Date, behavior?: Behavior);
    actionId: string;
}

import { Behavior } from "./behavior";
export declare class MessageContract<T> {
    readonly type: string;
    readonly data: T;
    readonly behavior: Behavior;
    constructor(type: string, data: T, behavior?: Behavior);
}

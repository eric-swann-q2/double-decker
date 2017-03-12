import { Action, Event } from "./message";
export declare type ActionCallback = (action: Action<any>) => any;
export declare type EventCallback = (event: Event<any>) => any;

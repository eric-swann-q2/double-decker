import { Action, Event } from "./message";

export type ActionCallback = (action: Action<any>) => any;
export type EventCallback = (event: Event<any>) => any;

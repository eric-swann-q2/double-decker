import { Category } from "./category";

export type ActionCallback = (action: Action<any>) => any;
export type EventCallback = (event: Event<any>) => any;

export class Message<T> {
  constructor(
    public readonly id: string,
    public readonly category: Category,
    public readonly type: string,
    public readonly data: T,
    public readonly timestamp: Date,
    public readonly shouldReplay: boolean) { }
}

export class Action<T> extends Message<T> {
  constructor(id: string, type: string, data: T, timestamp: Date, shouldReplay: boolean = true) {
    super(id, Category.Action, type, data, timestamp, shouldReplay);
  }
}

export class Event<T> extends Message<T> {
  constructor(id: string, type: string, data: T, timestamp: Date, shouldReplay: boolean = true) {
    super(id, Category.Event, type, data, timestamp, shouldReplay);
  }
}

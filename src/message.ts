import { Category } from "./category";

export type ActionCallback = (action: Action<any>) => any;
export type EventCallback = (event: Event<any>) => any;

export class Message<T> {

  constructor(
    public readonly id: string,
    public readonly category: Category,
    public readonly type: string,
    public readonly data: T,
    public readonly timestamp: Date) { }
}

export class Action<T> extends Message<T> {
  constructor(id: string, type: string, data: T, timestamp: Date) {
    super(id, Category.Action, type, data, timestamp);
  }
}

export class Event<T> extends Message<T> {
  constructor(id: string, type: string, data: T, timestamp: Date) {
    super(id, Category.Event, type, data, timestamp);
  }
}

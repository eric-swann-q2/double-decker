import { Category } from "./category";

export type ActionCallback = (action: Action<any>) => any;
export type EventCallback = (event: Event<any>) => any;

export class Behavior {
  mustPlay: boolean = false;
  playable: boolean = true;
}

export class Message<T> {
  constructor(
    public readonly id: string,
    public readonly category: Category,
    public readonly type: string,
    public readonly data: T,
    public readonly timestamp: Date,
    public readonly behavior = new Behavior()) { }
}

/** An action is used to send a commend, this will have one receiver. */
export class Action<T> extends Message<T> {
  constructor(id: string, type: string, data: T, timestamp: Date, shouldReplay: boolean = true) {
    super(id, Category.Action, type, data, timestamp);
  }
}

/** An event represents the outcome of an action, and may have many subscribers. */
export class Event<T> extends Message<T> {
  constructor(id: string, type: string, data: T, timestamp: Date, shouldReplay: boolean = true) {
    super(id, Category.Event, type, data, timestamp);
  }
}

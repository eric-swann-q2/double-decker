import { Category } from "./category";
import { Behavior } from "./behavior";

export class Message<T> {
  constructor(
    public readonly id: string,
    public readonly category: Category,
    public readonly type: string,
    public readonly data: T,
    public readonly timestamp: Date,
    public readonly behavior: Behavior) { }
}

/** An action is used to send a command, this will have one receiver. */
export class Action<T> extends Message<T> {
  constructor(id: string, type: string, data: T, timestamp: Date, behavior = new Behavior()) {
    super(id, Category.Action, type, data, timestamp, behavior);
  }
}

/** An event represents the outcome of an action, and may have many subscribers. */
export class Event<T> extends Message<T> {
  constructor(id: string, type: string, data: T, timestamp: Date, behavior = new Behavior()) {
    super(id, Category.Event, type, data, timestamp, behavior);
  }

  actionId: string;
}

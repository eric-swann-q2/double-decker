import { Action, Event } from "./message";

export interface IStore {
  readonly actions: Array<Action<any>>;
  readonly events: Array<Event<any>>;

  addAction(action: Action<any>): void;
  addEvent(event: Event<any>): void;

  clearActions(): void;
  clearEvents(): void;
}

export class MemoryStore implements IStore {
  readonly actions = new Array<Action<any>>();
  readonly events = new Array<Event<any>>();

  addAction(action: Action<any>): void {
    this.actions.push(action);
  }
  addEvent(event: Event<any>): void {
    this.events.push(event);
  }

  clearActions(): void {
    this.actions.length = 0;
  }
  clearEvents(): void {
    this.events.length = 0;
  }
}

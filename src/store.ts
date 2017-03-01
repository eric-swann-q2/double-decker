import { Action, Event } from "./messages/message";

/** Interface for message storage */
export interface IStore {
  /** Current store of actions */
  readonly actions: Array<Action<any>>;
  /** Current store of events */
  readonly events: Array<Event<any>>;

  /** Adds an action to storage */
  addAction(action: Action<any>): void;
  /** Adds an event to storage */
  addEvent(event: Event<any>): void;

  /** Clears actions from storage */
  clearActions(): void;
  /** Clears events from storage */
  clearEvents(): void;
}

/** In memory message store. Stores bus messages in local memory. */
export class MemoryStore implements IStore {
  /** Current store of actions */
  readonly actions = new Array<Action<any>>();
  /** Current store of events */
  readonly events = new Array<Event<any>>();

  /** Adds an action to storage */
  addAction(action: Action<any>): void {
    this.actions.push(action);
  }
  /** Adds an event to storage */
  addEvent(event: Event<any>): void {
    this.events.push(event);
  }

  /** Clears actions from storage */
  clearActions(): void {
    this.actions.length = 0;
  }
  /** Clears events from storage */
  clearEvents(): void {
    this.events.length = 0;
  }
}

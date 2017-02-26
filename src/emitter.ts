import { Action, ActionCallback, Event, EventCallback } from "./message";

export interface IEmitter {
  readonly receivers: any;
  readonly subscribers: any;

  emitAction(action: Action<any>): void;
  emitEvent(event: Event<any>): void;

}

export class Emitter implements IEmitter {
  readonly receivers: {};
  readonly subscribers: {};

  emitAction(action: Action<any>): void {
    const receiver: ActionCallback = this.receivers[action.type];

    if (!receiver) {
      throw new Error(`Double-Decker Receiver was not registered for type ${action.type}.`);
    }
    receiver(action);
  }

  emitEvent(event: Event<any>): void {
    const subscribers: EventCallback[] = this.subscribers[event.type];
    if (subscribers) {
      subscribers.forEach(callback => callback(event));
    }
  }
}

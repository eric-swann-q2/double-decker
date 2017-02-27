import { ILogger } from "./logger";
import { Action, ActionCallback, Event, EventCallback } from "./message";

export interface IEmitter {
  addReceiver(type: string, receiver: ActionCallback): void;
  removeReceiver(type: string, receiver: ActionCallback): ActionCallback;
  getReceiver(type: string): ActionCallback;
  emitAction(action: Action<any>): Promise<any>;

  addSubscriber(type: string, subscriber: EventCallback): void;
  removeSubscriber(type: string, subscriber: EventCallback): EventCallback;
  getSubscribers(type: string): EventCallback[];
  emitEvent(event: Event<any>): Array<Promise<any>>;
}

export class Emitter implements IEmitter {
  private _receiverStore = {};
  private _subscriberStore = {};

  constructor(private _logger: ILogger) { }

  addReceiver(type: string, receiver: ActionCallback): void {
    const lowerType = type.toLowerCase();
    const existingReceiver = this._receiverStore[lowerType];
    if (existingReceiver) {
      const errorMessage = `Double-Decker Emitter: [addReceiver] : Action receiver was already present for type ${type}: Receiver: ${existingReceiver}`;
      this._throwError(errorMessage);
    }

    this._logger.debug(`Double-Decker Emitter: [addReceiver] : Adding Action receiver for type: ${type}: Receiver: ${receiver}`);
    this._receiverStore[lowerType] = receiver;
  }

  removeReceiver(type: string, receiver: ActionCallback): ActionCallback {
    const lowerType = type.toLowerCase();
    const existingReceiver = this._receiverStore[lowerType];
    if (!existingReceiver || receiver !== existingReceiver) {
      const errorMessage = `Double-Decker Emitter: [removeReceiver] : Action receiver to remove was not registered for type ${type}: Receiver: ${receiver}`;
      this._throwError(errorMessage);
    }
    this._receiverStore[lowerType] = undefined;
    this._logger.debug(`Double-Decker Emitter: [removeReceiver] : Removed Action receiver for type: ${type}: Receiver: ${receiver}`);
    return receiver;
  }

  getReceiver(type: string): ActionCallback {
    this._logger.debug(`Double-Decker Emitter: [getReceiver] : Getting Action receiver for type: ${type}.`);
    return this._receiverStore[type.toLowerCase()];
  }

  emitAction(action: Action<any>): Promise<any> {
    const receiver: ActionCallback = this._receiverStore[action.type.toLowerCase()];
    if (!receiver) {
      const errorMessage = `Double-Decker Emitter: [emitAction] : Receiver was not registered for type ${action.type}.`;
      this._throwError(errorMessage);
    }
    this._logger.debug(`Double-Decker Emitter: [emitAction] : Emitting Action for type: ${action.type}. Action: ${action}. Receiver: ${receiver}`);
    return Promise.resolve(receiver(action));
  }

  addSubscriber(type: string, subscriber: EventCallback): void {
    const lowerType = type.toLowerCase();
    let subscribers = this._subscriberStore[lowerType];
    if (!subscribers) {
      this._logger.debug(`Double-Decker Emitter: [addSubscriber] : No subscribers registered for type: ${type}. Registering a new store array.`);
      subscribers = new Array<EventCallback>();
      this._subscriberStore[lowerType] = subscribers;
    }
    subscribers.push(subscriber);
    this._logger.debug(`Double-Decker Emitter: [addSubscriber] : Added subscriber for type: ${type} : ${subscriber}`);
  }

  removeSubscriber(type: string, subscriber: EventCallback): EventCallback {
    const lowerType = type.toLowerCase();
    const subscribers = this._subscriberStore[lowerType];

    if (subscribers) {
      const itemIndex = subscribers.indexOf(subscriber);
      if (itemIndex >= 0) {
        subscribers.splice(itemIndex, 1);
        this._logger.debug(`Double-Decker Emitter: [removeSubscriber] : Removed subscriber at index ${itemIndex}: Subscriber: ${subscriber}`);
        return subscriber;
      }
    }
    const errorMessage = `Double-Decker Emitter: [removeSubscriber] : Subscriber to unsubscribe was not registered for type ${type}: ${subscriber}`;
    this._throwError(errorMessage);
  }

  getSubscribers(type: string): EventCallback[] {
    this._logger.debug(`Double-Decker Emitter: [getSubscribers] : Getting Event subscribers for type: ${type}.`);
    return this._subscriberStore[type.toLowerCase()];
  }

  emitEvent(event: Event<any>): Array<Promise<any>> {
    const resultPromises = new Array<Promise<any>>();
    const subscribers: EventCallback[] = this._subscriberStore[event.type.toLowerCase()];
    if (subscribers) {
      subscribers.forEach(subscriber => {
        this._logger.debug(`Double-Decker Emitter: [emitEvent] : Emitting Event for type: ${event.type}. Event: ${event}. Subscriber:${subscriber}`);
        resultPromises.push(subscriber(event));
      });
    }
    return resultPromises;
  }

  private _throwError(errorMessage: string): void {
    this._logger.error(errorMessage);
    throw new Error(errorMessage);
  }
}

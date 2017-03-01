import { ILogger } from "./logger";
import { Action, Event } from "./messages/message";
import { ActionCallback, EventCallback } from "./messages/callbacks";

/** Interface for an emitter, which emits actions and events to receivers and subscribers */
export interface IEmitter {
  /** The last action sent by the emitter */
  readonly lastAction: Action<any>;
  /** The last event published by the emitter */
  readonly lastEvent: Event<any>;

  /** Adds an action receiver */
  addReceiver(type: string, receiver: ActionCallback): void;
  /** Removes an action receiver */
  removeReceiver(type: string, receiver: ActionCallback): ActionCallback;
  /** Gets an action receiver */
  getReceiver(type: string): ActionCallback;
  /** Emit an action to the action receiver */
  emitAction(action: Action<any>): Promise<any>;

  /** Adds an event subscriber */
  addSubscriber(type: string, subscriber: EventCallback): void;
  /** Removes an event subscriber */
  removeSubscriber(type: string, subscriber: EventCallback): EventCallback;
  /** Gets event subscribers */
  getSubscribers(type: string): EventCallback[];
  /** Emit an event to all event subscribers */
  emitEvent(event: Event<any>): Array<Promise<any>>;
}

/** An emitter emits actions and events to receivers and subscribers */
export class Emitter implements IEmitter {
  private _receiverStore = {};
  private _subscriberStore = {};

  private _lastAction: Action<any>;
  private _lastEvent: Event<any>;

  /** The last action sent by the bus */
  get lastAction(): Action<any> {
    return this._lastAction;
  }

  /** The last event sent by the bus */
  get lastEvent(): Event<any> {
    return this._lastEvent;
  }

  constructor(private _logger: ILogger) { }

  /** Adds an action receiver */
  addReceiver(type: string, receiver: ActionCallback): void {
    const lowerType = type.toLowerCase();
    const existingReceiver = this._receiverStore[lowerType];
    if (existingReceiver) {
      this._throwError(`Double-Decker Emitter: [addReceiver] : Action receiver was already present for type ${type}: Receiver: ${existingReceiver}`);
    }

    this._logger.debug(`Double-Decker Emitter: [addReceiver] : Adding Action receiver for type: ${type}: Receiver: ${receiver}`);
    this._receiverStore[lowerType] = receiver;
  }

  /** Removes an action receiver */
  removeReceiver(type: string, receiver: ActionCallback): ActionCallback {
    const lowerType = type.toLowerCase();
    const existingReceiver = this._receiverStore[lowerType];
    if (!existingReceiver || receiver !== existingReceiver) {
      this._throwError(`Double-Decker Emitter: [removeReceiver] : Action receiver to remove was not registered for type ${type}: Receiver: ${receiver}`);
    }
    this._receiverStore[lowerType] = undefined;
    this._logger.debug(`Double-Decker Emitter: [removeReceiver] : Removed Action receiver for type: ${type}: Receiver: ${receiver}`);
    return receiver;
  }

  /** Gets an action receiver */
  getReceiver(type: string): ActionCallback {
    this._logger.debug(`Double-Decker Emitter: [getReceiver] : Getting Action receiver for type: ${type}.`);
    return this._receiverStore[type.toLowerCase()];
  }

  /** Emit an action to the action receiver */
  emitAction(action: Action<any>): Promise<any> {
    const receiver: ActionCallback = this._receiverStore[action.type.toLowerCase()];
    if (!receiver) {
      this._throwError(`Double-Decker Emitter: [emitAction] : Receiver was not registered for type ${action.type}.`);
    }
    this._logger.debug(`Double-Decker Emitter: [emitAction] : Emitting Action for type: ${action.type}. Action: ${action}. Receiver: ${receiver}`);

    const result = receiver(action);
    this._lastAction = action;
    return Promise.resolve(result);
  }

  /** Adds an event subscriber */
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

  /** Removes an event subscriber */
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
    this._throwError(`Double-Decker Emitter: [removeSubscriber] : Subscriber to unsubscribe was not registered for type ${type}: ${subscriber}`);
  }

  /** Gets event subscribers */
  getSubscribers(type: string): EventCallback[] {
    this._logger.debug(`Double-Decker Emitter: [getSubscribers] : Getting Event subscribers for type: ${type}.`);
    return this._subscriberStore[type.toLowerCase()];
  }

  /** Emit an event to all event subscribers */
  emitEvent(event: Event<any>): Array<Promise<any>> {
    const resultPromises = new Array<Promise<any>>();
    const subscribers: EventCallback[] = this._subscriberStore[event.type.toLowerCase()];
    if (subscribers) {
      subscribers.forEach(subscriber => {
        this._logger.debug(`Double-Decker Emitter: [emitEvent] : Emitting Event for type: ${event.type}. Event: ${event}. Subscriber:${subscriber}`);
        resultPromises.push(Promise.resolve(subscriber(event)));
      });
    }
    if (this.lastAction) {
      event.actionId = this.lastAction.id;
    }
    this._lastEvent = event;
    return resultPromises;
  }

  private _throwError(errorMessage: string): void {
    this._logger.error(errorMessage);
    throw new Error(errorMessage);
  }
}

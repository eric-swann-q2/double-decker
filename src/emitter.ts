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
  removeReceiver(type: string, receiver: ActionCallback): void;
  /** Emit an action to the action receiver */
  emitAction(action: Action<any>): Promise<any>;

  /** Adds an event subscriber */
  addSubscriber(type: string, subscriber: EventCallback): void;
  /** Removes an event subscriber */
  removeSubscriber(type: string, subscriber: EventCallback): void;
  /** Emit an event to all event subscribers */
  emitEvent(event: Event<any>): Promise<any>;
}

/** An emitter emits actions and events to receivers and subscribers */
export class Emitter implements IEmitter {
  private _receiverStore = new Map<string, ActionCallback>();
  private _subscriberStore = new Map<string, EventCallback[]>();

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
    const existingReceiver = this._receiverStore.get(lowerType);
    if (existingReceiver) {
      this._throwError(`Double-Decker Emitter: [addReceiver] : Action receiver was already present for type ${type}: Receiver: ${existingReceiver}`);
    }

    this._logger.debug(`Double-Decker Emitter: [addReceiver] : Adding Action receiver for type: ${type}: Receiver: ${receiver}`);
    this._receiverStore.set(lowerType, receiver);
  }

  /** Removes an action receiver */
  removeReceiver(type: string, receiver: ActionCallback): void {
    const lowerType = type.toLowerCase();
    const existingReceiver = this._receiverStore.get(lowerType);
    if (!existingReceiver || receiver !== existingReceiver) {
      this._throwError(`Double-Decker Emitter: [removeReceiver] : Action receiver to remove was not registered for type ${type}: Receiver: ${receiver}`);
    }
    this._receiverStore.delete(lowerType);
    this._logger.debug(`Double-Decker Emitter: [removeReceiver] : Removed Action receiver for type: ${type}: Receiver: ${receiver}`);
  }

  /** Gets an action receiver */
  getReceiver(type: string): ActionCallback {
    this._logger.debug(`Double-Decker Emitter: [getReceiver] : Getting Action receiver for type: ${type}.`);
    return this._receiverStore.get(type.toLowerCase());
  }

  /** Emit an action to the action receiver */
  emitAction(action: Action<any>): Promise<any> {
    const receiver = this._receiverStore.get(action.type.toLowerCase());
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
    let subscribers = this._subscriberStore.get(lowerType);
    if (!subscribers) {
      this._logger.debug(`Double-Decker Emitter: [addSubscriber] : No subscribers registered for type: ${type}. Registering a new store array.`);
      subscribers = new Array<EventCallback>();
      this._subscriberStore.set(lowerType, subscribers);
    }
    subscribers.push(subscriber);
    this._logger.debug(`Double-Decker Emitter: [addSubscriber] : Added subscriber for type: ${type} : ${subscriber}`);
  }

  /** Removes an event subscriber */
  removeSubscriber(type: string, subscriber: EventCallback): void {
    const lowerType = type.toLowerCase();
    const subscribers = this._subscriberStore.get(lowerType);

    if (subscribers) {
      const itemIndex = subscribers.indexOf(subscriber);
      if (itemIndex >= 0) {
        subscribers.splice(itemIndex, 1);
        this._logger.debug(`Double-Decker Emitter: [removeSubscriber] : Removed subscriber at index ${itemIndex}: Subscriber: ${subscriber}`);
        return;
      }
    }
    this._throwError(`Double-Decker Emitter: [removeSubscriber] : Subscriber to unsubscribe was not registered for type ${type}: ${subscriber}`);
  }

  /** Gets event subscribers */
  getSubscribers(type: string): EventCallback[] {
    this._logger.debug(`Double-Decker Emitter: [getSubscribers] : Getting Event subscribers for type: ${type}.`);
    return this._subscriberStore.get(type.toLowerCase());
  }

  /** Emit an event to all event subscribers */
  emitEvent(event: Event<any>): Promise<any> {
    const resultPromises = new Array<Promise<any>>();
    const subscribers = this._subscriberStore.get(event.type.toLowerCase());
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
    return Promise.all(resultPromises);
  }

  private _throwError(errorMessage: string): void {
    this._logger.error(errorMessage);
    throw new Error(errorMessage);
  }
}

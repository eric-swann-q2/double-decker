import { IEmitter } from "./emitter";
import { IStore } from "./store";
import { ILogger } from "./logger";
import { IMessageFactory } from "./messageFactory";
import { ActionCallback, EventCallback } from "./message";

export interface IBus {
  send(type: string, data: any): Promise<any>;
  receive(type: string, callback: ActionCallback): void;
  unreceive(type: string, callback: ActionCallback): void;

  publish(type: string, data: any): void;
  subscribe(type: string, callback: EventCallback): void;
  unsubscribe(type: string, callback: EventCallback): void;
}

export class Bus implements IBus {

  constructor(
    private readonly _messageFactory: IMessageFactory, private readonly _emitter: IEmitter,
    private readonly _store: IStore, private readonly _logger: ILogger) { }

  send(type: string, data: any): Promise<any> {
    const action = this._messageFactory.CreateAction(type, data);

    this._logger.debug(`Double-Decker Bus: [send] : Sending action: ${action}`);
    const emitResult = this._emitter.emitAction(action);
    this._store.addAction(action);

    return Promise.resolve(emitResult);
  }

  receive(type: string, callback: ActionCallback): void {
    this._emitter.receivers[type.toLowerCase()] = callback;
    this._logger.debug(`Double-Decker Bus: [receive] : Receiver set for ${type}: ${callback}`);
  }

  unreceive(type: string, callback: ActionCallback): void {
    this._emitter.receivers[type.toLowerCase()] = undefined;
    this._logger.debug(`Double-Decker Bus: [receive] : Receiver removed for ${type}: ${callback}`);
  }

  publish(type: string, data: any): void {
    const event = this._messageFactory.CreateEvent(type, data);

    this._logger.debug(`Double-Decker Bus: [publish] : Publishing event: ${event}`);
    this._emitter.emitEvent(event);
    this._store.addEvent(event);
  }

  subscribe(type: string, callback: EventCallback): void {
    const lowerType = type.toLowerCase();
    let subscribers = this._emitter.subscribers[lowerType];
    if (!subscribers) {
      subscribers = [];
      this._emitter.subscribers[lowerType] = subscribers;
    }
    subscribers.push(callback);
    this._logger.debug(`Double-Decker Bus: [subscribe] : Appended subscriber: ${callback}`);
  }

  unsubscribe(type: string, callback: EventCallback): void {
    const lowerType = type.toLowerCase();
    const subscribers = this._emitter.subscribers[lowerType];
    let subscriberFound = false;

    if (subscribers) {
      const itemIndex = subscribers.indexOf(callback);
      if (itemIndex >= 0) {
        this._logger.debug(`Double-Decker Bus: [unsubscribe] : Removed subscriber at index ${itemIndex}: ${callback}`);
        subscribers.splice(itemIndex, 1);
        subscriberFound = true;
      }
    }
    if (!subscriberFound) {
      const errorMessage = `Double-Decker Bus: [unsubscribe] : Subscriber to unsubscribe was not registered for type ${type}: ${callback}`;
      this._logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

}

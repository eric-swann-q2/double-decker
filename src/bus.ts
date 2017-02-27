import { IEmitter } from "./emitter";
import { IStore } from "./store";
import { ILogger } from "./logger";
import { IMessageFactory } from "./message-factory";
import { ActionCallback, EventCallback } from "./message";

export interface IBus {
  receive(type: string, callback: ActionCallback): void;
  unreceive(type: string, callback: ActionCallback): ActionCallback;
  send(type: string, data: any): Promise<any>;

  subscribe(type: string, callback: EventCallback): void;
  unsubscribe(type: string, callback: EventCallback): EventCallback;
  publish(type: string, data: any): Array<Promise<any>>;
}

export class Bus implements IBus {

  constructor(
    private readonly _messageFactory: IMessageFactory, private readonly _emitter: IEmitter,
    private readonly _store: IStore, private readonly _logger: ILogger) { }

  receive(type: string, receiver: ActionCallback): void {
    this._emitter.addReceiver(type, receiver);
    this._logger.debug(`Double-Decker Bus: [receive] : Receiver set for ${type}: ${receiver}`);
  }

  unreceive(type: string, receiver: ActionCallback): ActionCallback {
    const removed = this._emitter.removeReceiver(type.toLowerCase(), receiver);
    this._logger.debug(`Double-Decker Bus: [unreceive] : Receiver removed for ${type}: ${receiver}`);
    return removed;
  }

  send(type: string, data: any): Promise<any> {
    const action = this._messageFactory.CreateAction(type, data);

    this._logger.debug(`Double-Decker Bus: [send] : Sending action: ${action}`);
    const emitResult = this._emitter.emitAction(action);
    this._store.addAction(action);

    return emitResult;
  }

  subscribe(type: string, subscriber: EventCallback): void {
    this._emitter.addSubscriber(type, subscriber);
    this._logger.debug(`Double-Decker Bus: [subscribe] : Appended subscriber for type: ${type} : ${subscriber}`);
  }

  unsubscribe(type: string, subscriber: EventCallback): EventCallback {
    const removed = this._emitter.removeSubscriber(type, subscriber);
    this._logger.debug(`Double-Decker Bus: [unsubscribe] : Subscriber removed for ${type}: ${subscriber}`);
    return removed;
  }

  publish(type: string, data: any): Array<Promise<any>> {
    const event = this._messageFactory.CreateEvent(type, data);

    this._logger.debug(`Double-Decker Bus: [publish] : Publishing event: ${event}`);
    const results = this._emitter.emitEvent(event);
    this._store.addEvent(event);
    return results;
  }

}

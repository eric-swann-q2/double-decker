import { IEmitter } from "./emitter";
import { IStore } from "./store";
import { ILogger } from "./logger";
import { IMessageFactory } from "./message-factory";
import { ActionCallback, EventCallback, Action, Event } from "./message";

/** Interface describing all service bus operations */
export interface IBus {
  /** Sign up an ActionCallback to receive actions */
  receive(type: string, callback: ActionCallback): void;
  /** Remove an ActionCallback from receiving actions */
  unreceive(type: string, callback: ActionCallback): ActionCallback;
  /** Send an action to a registered receiver */
  send(type: string, data: any): Promise<any>;
  /** The last action sent by the bus */
  readonly lastAction: Action<any>;

  /** Sign up an EventCallback to receive events */
  subscribe(type: string, callback: EventCallback): void;
  /** Remove an EventCallback from receiving events */
  unsubscribe(type: string, callback: EventCallback): EventCallback;
  /** Publish an event to all subscribers */
  publish(type: string, data: any): Array<Promise<any>>;
  /** The last action sent by the bus */
  readonly lastEvent: Event<any>;
}

/** Service bus class used to send and publish messages, 
 * as well as subscribe to messages. */
export class Bus implements IBus {

  private _lastAction: Action<any>;
  private _lastEvent: Event<any>;

  constructor(
    private readonly _messageFactory: IMessageFactory, private readonly _emitter: IEmitter,
    private readonly _store: IStore, private readonly _logger: ILogger) { }

  /** Sign up an ActionCallback to receive actions */
  receive(type: string, receiver: ActionCallback): void {
    this._emitter.addReceiver(type, receiver);
    this._logger.debug(`Double-Decker Bus: [receive] : Receiver set for ${type}: ${receiver}`);
  }

  /** Remove an ActionCallback from receiving actions */
  unreceive(type: string, receiver: ActionCallback): ActionCallback {
    const removed = this._emitter.removeReceiver(type.toLowerCase(), receiver);
    this._logger.debug(`Double-Decker Bus: [unreceive] : Receiver removed for ${type}: ${receiver}`);
    return removed;
  }

  /** Send an action to a registered receiver */
  send(type: string, data: any): Promise<any> {
    const action = this._messageFactory.CreateAction(type, data);

    this._logger.debug(`Double-Decker Bus: [send] : Sending action: ${action}`);
    const emitResult = this._emitter.emitAction(action);
    this._store.addAction(action);
    this._lastAction = action;
    return emitResult;
  }

  /** The last action sent by the bus */
  get lastAction(): Action<any> {
    return this._lastAction;
  }

  /** Sign up an EventCallback to receive events */
  subscribe(type: string, subscriber: EventCallback): void {
    this._emitter.addSubscriber(type, subscriber);
    this._logger.debug(`Double-Decker Bus: [subscribe] : Appended subscriber for type: ${type} : ${subscriber}`);
  }

  /** Remove an EventCallback from receiving events */
  unsubscribe(type: string, subscriber: EventCallback): EventCallback {
    const removed = this._emitter.removeSubscriber(type, subscriber);
    this._logger.debug(`Double-Decker Bus: [unsubscribe] : Subscriber removed for ${type}: ${subscriber}`);
    return removed;
  }

  /** Publish an event to all subscribers */
  publish(type: string, data: any): Array<Promise<any>> {
    const event = this._messageFactory.CreateEvent(type, data);

    this._logger.debug(`Double-Decker Bus: [publish] : Publishing event: ${event}`);
    const results = this._emitter.emitEvent(event);
    this._store.addEvent(event);
    this._lastEvent = event;
    return results;
  }

  /** The last event sent by the bus */
  get lastEvent(): Event<any> {
    return this._lastEvent;
  }

}

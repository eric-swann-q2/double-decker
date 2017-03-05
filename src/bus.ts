import { IEmitter } from "./emitter";
import { IStore } from "./store";
import { ILogger } from "./logger";
import { IMessageFactory } from "./message-factory";
import { Behavior } from "./messages/behavior";
import { MessageContract } from "./messages/message-contract";
import { Action, Event } from "./messages/message";
import { ActionCallback, EventCallback } from "./messages/callbacks";

/** Interface describing all service bus operations */
export interface IBus {

  /** The last action sent by the bus */
  readonly lastAction: Action<any>;
  /** The last event published by the bus */
  readonly lastEvent: Event<any>;

  /** Sign up an ActionCallback to receive actions */
  receive(type: string, callback: ActionCallback): void;
  /** Remove an ActionCallback from receiving actions */
  unreceive(type: string, callback: ActionCallback): void;
  /** Send an action to a registered receiver */
  send<T>(action: MessageContract<T>): Promise<any>;
  /** Send an action to a registered receiver */
  createAndSend(type: string, data: any): Promise<any>;

  /** Sign up an EventCallback to receive events */
  subscribe(type: string, callback: EventCallback): void;
  /** Remove an EventCallback from receiving events */
  unsubscribe(type: string, callback: EventCallback): void;
  /** Publish an event to all subscribers */
  publish<T>(event: MessageContract<T>): Promise<any>;
  /** Publish an event to all subscribers */
  createAndPublish(type: string, data: any): Promise<any>;
}

/** Service bus class used to send and publish messages, as well as subscribe to messages. */
export class Bus implements IBus {

  constructor(
    private readonly _messageFactory: IMessageFactory, private readonly _emitter: IEmitter,
    private readonly _store: IStore, private readonly _logger: ILogger) { }

  /** The last action sent by the bus */
  get lastAction(): Action<any> {
    return this._emitter.lastAction;
  }

  /** The last event sent by the bus */
  get lastEvent(): Event<any> {
    return this._emitter.lastEvent;
  }

  /** Sign up an ActionCallback to receive actions */
  receive(type: string, receiver: ActionCallback): void {
    this._emitter.addReceiver(type, receiver);
    this._logger.debug(`Double-Decker Bus: [receive] : Receiver set for ${type}: ${receiver}`);
  }

  /** Remove an ActionCallback from receiving actions */
  unreceive(type: string, receiver: ActionCallback): void {
    const removed = this._emitter.removeReceiver(type.toLowerCase(), receiver);
    this._logger.debug(`Double-Decker Bus: [unreceive] : Receiver removed for ${type}: ${receiver}`);
  }

  /** Send an action to a registered receiver */
  send<T>(actionContract: MessageContract<T>): Promise<any> {
    const action = this._messageFactory.CreateAction(actionContract);

    this._logger.debug(`Double-Decker Bus: [send] : Sending action: ${action}`);
    const emitResult = this._emitter.emitAction(action);
    this._store.addAction(action);
    return emitResult;
  }

  /** Send an action to a registered receiver */
  createAndSend(type: string, data: any): Promise<any> {
    return this.send(new MessageContract(type, data));
  }

  /** Sign up an EventCallback to receive events */
  subscribe(type: string, subscriber: EventCallback): void {
    this._emitter.addSubscriber(type, subscriber);
    this._logger.debug(`Double-Decker Bus: [subscribe] : Appended subscriber for type: ${type} : ${subscriber}`);
  }

  /** Remove an EventCallback from receiving events */
  unsubscribe(type: string, subscriber: EventCallback): void {
    const removed = this._emitter.removeSubscriber(type, subscriber);
    this._logger.debug(`Double-Decker Bus: [unsubscribe] : Subscriber removed for ${type}: ${subscriber}`);
  }

  /** Publish an event to all subscribers */
  publish<T>(eventContract: MessageContract<T>): Promise<any> {
    const event = this._messageFactory.CreateEvent(eventContract);

    this._logger.debug(`Double-Decker Bus: [publish] : Publishing event: ${event}`);
    this._store.addEvent(event);
    return this._emitter.emitEvent(event);
  }

  /** Send an action to a registered receiver */
  createAndPublish(type: string, data: any): Promise<any> {
    return this.publish(new MessageContract(type, data));
  }

}

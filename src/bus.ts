import { IEmitter } from "./emitter";
import { IStore } from "./store";
import { ILogger } from "./logger";
import { IMessageFactory } from "./message-factory";
import { Behavior } from "./messages/behavior";
import { MessageContract } from "./messages/message-contract";
import { Action, Event } from "./messages/message";
import { ActionCallback, EventCallback } from "./messages/callbacks";
import { SystemMessage, MessageStatusData } from "./messages/systemMessage";

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
  send<T>(action: MessageContract<T>): void;
  /** Send an action to a registered receiver */
  createAndSend(type: string, data: any): void;

  /** Sign up an EventCallback to receive events */
  subscribe(type: string, callback: EventCallback): void;
  /** Remove an EventCallback from receiving events */
  unsubscribe(type: string, callback: EventCallback): void;
  /** Publish an event to all subscribers */
  publish<T>(event: MessageContract<T>): void;
  /** Publish an event to all subscribers */
  createAndPublish(type: string, data: any): void;
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
  send<T>(actionContract: MessageContract<T>): void {
    const action = this._messageFactory.CreateAction(actionContract);
    this._emitSystemMessage(SystemMessage.ActionSent, action.id);

    this._logger.debug(`Double-Decker Bus: [send] : Sending action: ${action}`);
    this._emitter.emitAction(action)
      .then(result => {
        this._store.addAction(action);
        this._emitSystemMessage(SystemMessage.ActionSent, action.id);
      })
      .catch(error => {
        this._emitSystemMessage(SystemMessage.ActionErred, action.id, error);
      });
  }

  /** Send an action to a registered receiver */
  createAndSend(type: string, data: any): void {
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
  publish<T>(eventContract: MessageContract<T>): void {
    const event = this._messageFactory.CreateEvent(eventContract);
    this._logger.debug(`Double-Decker Bus: [publish] : Publishing event: ${event}`);

    this._emitter.emitEvent(event)
      .then(result => {
        this._store.addEvent(event);
        this._emitSystemMessage(SystemMessage.EventPublished, event.id);
      })
      .catch(error => {
        this._emitSystemMessage(SystemMessage.EventErred, event.id, error);
      });
  }

  /** Send an action to a registered receiver */
  createAndPublish(type: string, data: any): void {
    this.publish(new MessageContract(type, data));
  }

  private _emitSystemMessage(type: SystemMessage, originalMessageId: string, error: Error = null) {
    const systemMessage = this._messageFactory.CreateSystemEvent(type, new MessageStatusData(originalMessageId, error));
    this._logger.debug(`Double-Decker Bus: [emitSystemMessage] 
      : Emitting a system message: ${type} : ID ${systemMessage.id} : OriginalMessageId: ${originalMessageId}`);
    if (type === SystemMessage.ActionErred || type === SystemMessage.EventErred) {
      this._logger.error(`Double-Decker Bus: [emitSystemMessage] 
      : Message Failure: ${type} : ID ${systemMessage.id} : OriginalMessageId: ${originalMessageId} : Error: ${error}`);
    }
    this._emitter.emitEvent(systemMessage);
  }
}

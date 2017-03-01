import { IEmitter } from "./emitter";
import { ILogger } from "./logger";
import { Category } from "./messages/category";
import { IStore } from "./store";
import { Action, Event, Message } from "./messages/message";

export interface IPlayer<TMessage extends Message<any>> {
  readonly messages: TMessage[];
  readonly next: TMessage;
  readonly previous: TMessage;

  setHead(position: number): void;
  setHeadById(messageId: string): void;

  play(length: number): Array<Promise<any>>;
  playNext(): Promise<any>;

  clear(): void;
}

export interface IActionPlayer extends IPlayer<Action<any>> { }
export interface IEventPlayer extends IPlayer<Event<any>> { }

export abstract class Player<TMessage extends Message<any>> implements IPlayer<TMessage> {

  constructor(private _logger: ILogger) { }

  readonly abstract messages: TMessage[];

  protected _headPosition = 0;
  protected readonly abstract _category: Category;

  get next(): TMessage {
    if (this._headPosition < this.messages.length) {
      const message = this.messages[this._headPosition];
      this._logger.debug(`Double-Decker Hub: [next] : Retrieving next ${this._category} at position ${this._headPosition}.`, message);
      return message;
    }
    this._logger.debug(`Double-Decker Hub: [next] : read head is at max position, no next ${this._category}`);
    return undefined;
  }

  get previous(): TMessage {
    if (this._headPosition > 0) {
      const position = this._headPosition - 1;
      const event = this.messages[position];
      this._logger.debug(`Double-Decker Hub: [previous] : Retrieving previous ${this._category} at position ${position}.`, event);
      return event;
    }
    this._logger.debug(`Double-Decker Hub: [previous] : eventHead is at position 0, no previous ${this._category}`);
    return undefined;
  }

  setHead(position: number): void {
    if (position < 0 || position >= this.messages.length) {
      this._throwError(`Double-Decker Hub: [setHead] : Attempted to set read head outside of message range. 
        Attempted value:${position}. Max value:${this.messages.length}`);
    }
    this._headPosition = position;
  }

  setHeadById(messageId: string): void {
    const position = this.messages.findIndex(msg => msg.id === messageId);
    if (position < 0) {
      this._throwError(`Double-Decker Hub: [setHeadById] : Could not find the requested messageId: ${messageId}`);
    }
    this._headPosition = position;
  }

  playNext(): Promise<any> {
    this._logger.debug(`Double-Decker Hub: [play] : Playing ${this._category} : ${this.next}`);
    const result = this._playNext();
    this._headPosition++;
    return result;
  }

  play(length: number): Array<Promise<any>> {
    const results = new Array<Promise<any>>();
    for (let i = 0; i < length; i++) {
      results.push(this.playNext());
    }
    return results;
  }

  clear(): void {
    this._logger.debug(`Double-Decker Hub: [reset] : Resetting ${this._category} hub`);
    this._clearMessages();
    this._headPosition = 0;
  }

  protected abstract _clearMessages(): void;
  protected abstract _playNext(): Promise<any>;

  protected _throwError(errorMessage: string): void {
    this._logger.error(errorMessage);
    throw new Error(errorMessage);
  }

}

export class ActionPlayer extends Player<Action<any>> implements IActionPlayer {

  constructor(
    private readonly _emitter: IEmitter,
    private readonly _store: IStore,
    private readonly logger: ILogger) {
    super(logger);
  }

  get messages() { return this._store.actions; }

  protected readonly _category: Category = Category.Action;

  protected _playNext(): Promise<any> {
    if (this.next.behavior.playable) {
      return this._emitter.emitAction(this.next);
    }
  }

  protected _clearMessages(): void {
    this._store.clearActions();
  }
}

export class EventPlayer extends Player<Event<any>> implements IEventPlayer {

  constructor(
    private readonly _emitter: IEmitter,
    private readonly _store: IStore,
    private readonly logger: ILogger) {
    super(logger);
  }

  get messages() { return this._store.events; }

  protected readonly _category: Category = Category.Event;

  protected _playNext(): Promise<any> {
    return Promise.all(this._emitter.emitEvent(this.next));
  }

  protected _clearMessages(): void {
    this._store.clearEvents();
  }
}

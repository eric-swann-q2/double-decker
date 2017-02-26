import { IEmitter } from "./emitter";
import { ILogger } from "./logger";
import { Category } from "./category";
import { IStore } from "./store";
import { Action, Event, Message } from "./message";

export interface IPlayer<TMessage extends Message<any>> {
  readonly next: TMessage;
  readonly previous: TMessage;

  setHead(position: number): void;
  setHeadById(messageId: string): void;

  play(length: number): void;

  clear(): void;
}

export interface IActionPlayer extends IPlayer<Action<any>> { }
export interface IEventPlayer extends IPlayer<Event<any>> { }

export abstract class Player<TMessage extends Message<any>> implements IPlayer<TMessage> {

  constructor(private _logger: ILogger) { }

  protected _headPosition = 0;
  protected readonly abstract _category: Category;
  protected readonly abstract _messages: TMessage[];

  get next(): TMessage {
    if (this._headPosition < this._messages.length) {
      const message = this._messages[this._headPosition];
      this._logger.debug(`Double-Decker Hub: [next] : Retrieving next ${this._category} at position ${this._headPosition}.`, message);
      return message;
    }
    this._logger.debug(`Double-Decker Hub: [next] : read head is at max position, no next ${this._category}`);
    return undefined;
  }

  get previous(): TMessage {
    if (this._headPosition > 0) {
      const position = this._headPosition - 1;
      const event = this._messages[position];
      this._logger.debug(`Double-Decker Hub: [previous] : Retrieving previous ${this._category} at position ${position}.`, event);
      return event;
    }
    this._logger.debug(`Double-Decker Hub: [previous] : eventHead is at position 0, no previous ${this._category}`);
    return undefined;
  }

  setHead(position: number): void {
    if (position < 0 || position >= this._messages.length) {
      const errorMessage = `Double-Decker Hub: [setHead] : Attempted to set read head outside of message range. 
                            Attempted value:${position}. Max value:${this._messages.length}`;
      this._logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    this._headPosition = position;
  }

  setHeadById(messageId: string): void {
    const position = this._messages.findIndex(msg => msg.id === messageId);
    if (position < 0) {
      const errorMessage = `Double-Decker Hub: [setHeadById] : Could not find the requested messageId: ${messageId}`;
      this._logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    this._headPosition = position;
  }

  play(length = 1): void {
    for (let i = 0; i < length; i++) {
      this._logger.debug(`Double-Decker Hub: [play] : Playing ${this._category} : ${this.next}`);
      this._playNext();
      this._headPosition++;
    }
  }

  clear(): void {
    this._logger.debug(`Double-Decker Hub: [reset] : Resetting ${this._category} hub`);
    this._clearMessages();
    this._headPosition = 0;
  }

  protected abstract _clearMessages(): void;
  protected abstract _playNext(): void;

}

export class ActionPlayer extends Player<Action<any>> implements IActionPlayer {

  constructor(private readonly _store: IStore, private _emitter: IEmitter, logger: ILogger) {
    super(logger);
  }

  protected readonly _category: Category = Category.Action;

  protected get _messages() { return this._store.actions; }

  protected _playNext(): void {
    this._emitter.emitAction(this.next);
  }

  protected _clearMessages(): void {
    this._store.clearActions();
  }
}

export class EventPlayer extends Player<Event<any>> implements IEventPlayer {

  constructor(private readonly _store: IStore, private _emitter: IEmitter, logger: ILogger) {
    super(logger);
  }

  protected readonly _category: Category = Category.Event;

  protected get _messages() { return this._store.events; }

  protected _playNext(): void {
    this._emitter.emitEvent(this.next);
  }

  protected _clearMessages(): void {
    this._store.clearEvents();
  }
}

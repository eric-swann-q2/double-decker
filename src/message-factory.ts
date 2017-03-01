import { createId } from "./push-id";
import { Action, Event } from "./messages/message";
import { MessageContract } from "./messages/message-contract";

/** Interface use to create new messages from message contracts */
export interface IMessageFactory {
  CreateAction<T>(actionContract: MessageContract<T>): Action<T>;
  CreateEvent<T>(eventContract: MessageContract<T>): Event<T>;
}

/** Used to create new messages from message contracts */
export class MessageFactory implements IMessageFactory {

  CreateAction<T>(actionContract: MessageContract<T>): Action<T> {
    return new Action<T>(createId(), actionContract.type.toLowerCase(), actionContract.data, new Date(), actionContract.behavior);
  }

  CreateEvent<T>(eventContract: MessageContract<T>): Event<T> {
    return new Event<T>(createId(), eventContract.type.toLowerCase(), eventContract.data, new Date(), eventContract.behavior);
  }

}

/** Used to create new messages from message contracts. The ID is retrieved from a property on the included data. Primarily used for testing. */
export class DataWithIdMessageFactory {

  constructor(public idProperty: string = "id") { }

  CreateAction<T>(actionContract: MessageContract<T>): Action<T> {
    return new Action<T>(actionContract.data[this.idProperty], actionContract.type.toLowerCase(), actionContract.data, new Date(), actionContract.behavior);
  }

  CreateEvent<T>(eventContract: MessageContract<T>): Event<T> {
    return new Event<T>(eventContract.data[this.idProperty], eventContract.type.toLowerCase(), eventContract.data, new Date(), eventContract.behavior);
  }

}

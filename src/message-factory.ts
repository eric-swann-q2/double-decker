import { createId } from "./push-id";
import { Action, Event } from "./message";

export interface IMessageFactory {
  CreateAction<T>(type: string, data: T): Action<T>;
  CreateEvent<T>(type: string, data: T): Event<T>;
}

export class MessageFactory implements IMessageFactory {

  CreateAction<T>(type: string, data: T): Action<T> {
    return new Action<T>(createId(), type.toLowerCase(), data, new Date());
  }

  CreateEvent<T>(type: string, data: T): Event<T> {
    return new Event<T>(createId(), type.toLowerCase(), data, new Date());
  }
}

export class DataWithIdMessageFactory {

  constructor(public idProperty: string = "id") { }

  CreateAction<T>(type: string, data: T): Action<T> {
    return new Action<T>(data[this.idProperty], type.toLowerCase(), data, new Date());
  }

  CreateEvent<T>(type: string, data: T): Event<T> {
    return new Event<T>(data[this.idProperty], type.toLowerCase(), data, new Date());
  }
}

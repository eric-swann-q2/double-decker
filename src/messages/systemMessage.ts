import { Behavior } from "./behavior";
import { Action, Event } from "./message";

export enum SystemMessageType {
  ActionSent = 0,
  EventPublished,
  ActionHandled,
  EventHandled,
  ActionErred,
  EventErred,
}

export class MessageStatusData {

  constructor(
    public messageId: string,
    public error: Error = null) { }
}

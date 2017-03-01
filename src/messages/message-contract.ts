import { Behavior } from "./behavior";

/** Used to define an action or event to publish */
export class MessageContract<T>{
  constructor(
    /** Identifies the type of the message, used for message routing */
    public readonly type: string,
    /** The data conveyed in the message */
    public readonly data: T,
    /** Determines how a message is treated in playback */
    public readonly behavior = new Behavior()) { }
}

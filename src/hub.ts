import { IActionPlayer, IEventPlayer } from "./player";
import { IBus } from "./bus";

export interface IHub {
  readonly bus: IBus;
  readonly actionPlayer: IActionPlayer;
  readonly eventPlayer: IEventPlayer;
}

export class Hub {

  constructor(
    readonly bus: IBus,
    readonly actionPlayer: IActionPlayer,
    readonly eventPlayer: IEventPlayer) { }

}

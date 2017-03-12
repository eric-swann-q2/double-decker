import { IActionPlayer, IEventPlayer } from "./player";
import { IBus } from "./bus";
export interface IHub {
    readonly bus: IBus;
    readonly actionPlayer: IActionPlayer;
    readonly eventPlayer: IEventPlayer;
}
export declare class Hub {
    readonly bus: IBus;
    readonly actionPlayer: IActionPlayer;
    readonly eventPlayer: IEventPlayer;
    constructor(bus: IBus, actionPlayer: IActionPlayer, eventPlayer: IEventPlayer);
}

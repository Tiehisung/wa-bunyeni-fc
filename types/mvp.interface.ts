import type { IMatch } from "./match.interface";
import type { IPlayerMini, EPlayerPosition } from "./player.interface";
import { IMiniUser } from "./user";

 

export interface IMVP {
    _id: string;
    player: IPlayerMini,
    match: IMatch,
    description?: string,
    date?: string
    positionPlayed?: EPlayerPosition

    createdBy?: IMiniUser
    createdAt?: string;
    updatedAt?: string;
}
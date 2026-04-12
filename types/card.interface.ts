import { IMatch, } from "./match.interface";
import { IPlayerMini } from "./player.interface";
import { IMiniUser } from "./user";

export enum ECardType {
    YELLOW = 'yellow',
    RED = 'red'
}

export interface ICard {
    _id: string;
    type: ECardType;
    match?: IMatch;
    player?: IPlayerMini
    minute?: string
    description?: string
    createdAt?: string
    updatedAt?: string
        createdBy?: IMiniUser
} 
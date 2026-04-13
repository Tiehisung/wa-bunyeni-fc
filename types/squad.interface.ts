import type { IMatch } from "./match.interface";
import { IPlayerMini } from "./player.interface";
import { IMiniUser } from "./user";

export interface ISquad {
    _id?: string;
    description?: string;
    title?: string;
    players: IPlayerMini[];
    coach?: { _id?: string; name: string; avatar?: string };
    assistant?: { _id?: string; name: string; avatar?: string };
    match: IMatch;
    formation?: string
    createdAt?: string;
    updatedAt?: string;
    createdBy?:IMiniUser
}
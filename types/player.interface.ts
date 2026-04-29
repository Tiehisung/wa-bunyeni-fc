import type { ICard } from "./card.interface";
import { EColor } from "./color";
import type { IGallery, ICloudinaryFile, } from "./file.interface";
import type { IInjury } from "./injury.interface";
import type { IGoal, IMatch } from "./match.interface";
import { IMiniUser } from "./user";


export interface IPlayerMini {
    _id: string;
    name: string;
    avatar?: string;
    number: number;
    position?:string
}

export interface IPlayer {
    _id: string;
    slug: string
    number: number;
    about?: string;
    code: string
    description?: string;
    galleries: IGallery[];
    captaincy: string;

    firstName: string;
    lastName: string;

    dateSigned: string;

    phone: string;
    email: string;
    dob: string;

    height: number;
    avatar: string;
    featureMedia?: ICloudinaryFile[];
    position: EPlayerPosition;
    favColor?: EColor
    //Stats
    goals: IGoal[];
    matches: IMatch[];
    ratings: { rating: number; match: string }[];
    assists: IGoal[];
    mvp: { _id: string; match: IMatch }[];
    passAcc: string;
    trophies: number;
    cards: ICard[];
    training: { team?: "A" | "B" };

    availability: EPlayerAvailability
    fitness: EPlayerFitness
    injuries: IInjury[]

    // Status
    issues: {
        title: string,
        description: string
        date: string;
    }[];

    status: 'current' | 'former'

    ageStatus: EPlayerAgeStatus

    manager: IPlayerManager;
    createdBy?: IMiniUser
}
export interface IPlayerManager {
    fullname: string;
    avatar?: string;
    phone: string;
}

export enum EPlayerAgeStatus {
    JUVENILE = "juvenile",
    YOUTH = "youth",
}

export enum EPlayerStatus {
    CURRENT = "current",
    FORMER = "former",
}

export enum EPlayerAvailability {
    AVAILABLE = "AVAILABLE",
    INJURED = "INJURED",
    SUSPENDED = "SUSPENDED",
    PERSONAL_LEAVE = "PERSONAL_LEAVE",
}

export enum EPlayerFitness {
    FIT = "FIT",
    MINOR_INJURY = "MINOR_INJURY",
    MAJOR_INJURY = "MAJOR_INJURY",
    RECOVERING = "RECOVERING",
    UNFIT = "UNFIT",
}

export enum EPlayerPosition {
    KEEPER = 'goal keeper',
    DEFENDER = 'defender',
    MIDFILDER = 'midfielder',
    FORWARD = 'forward',
    STRIKER = 'striker',
    WING_BACK = 'wing back',
    CENTER_BACK = 'center back',
    ATTACKING_MIDFIELDER = 'attacking midfielder',
    DEFENSIVE_MIDFIELDER = 'defensive midfielder',
    WINGER = 'winger',
    SWEEPER = 'sweeper'
}



export type PlayerPositionUI = {
    icon: string;
    color: EColor;
};

export const PLAYER_POSITION_UI_MAP: Record<EPlayerPosition, PlayerPositionUI> = {
    [EPlayerPosition.KEEPER]: {
        icon: "🧤",
        color: EColor.PURPLE,
    },

    [EPlayerPosition.DEFENDER]: {
        icon: "🛡️",
        color: EColor.BLUE,
    },

    [EPlayerPosition.CENTER_BACK]: {
        icon: "🧱",
        color: EColor.INGIGO,
    },

    [EPlayerPosition.WING_BACK]: {
        icon: "🏃‍♂️",
        color: EColor.TEAL,
    },

    [EPlayerPosition.SWEEPER]: {
        icon: "🧹",
        color: EColor.GRAY,
    },

    [EPlayerPosition.DEFENSIVE_MIDFIELDER]: {
        icon: "⚙️",
        color: EColor.GREEN,
    },

    [EPlayerPosition.MIDFILDER]: {
        icon: "🎯",
        color: EColor.GREEN,
    },

    [EPlayerPosition.ATTACKING_MIDFIELDER]: {
        icon: "🎨",
        color: EColor.YELLOW,
    },

    [EPlayerPosition.WINGER]: {
        icon: "⚡",
        color: EColor.ORANGE,
    },

    [EPlayerPosition.FORWARD]: {
        icon: "🚀",
        color: EColor.RED,
    },

    [EPlayerPosition.STRIKER]: {
        icon: "🥅",
        color: EColor.AMBER,
    },
};

export type ICaptain = {
    isActive?: boolean;
    _id: string;
    player: Partial<IPlayerMini>;
    role: "captain" | "vice";
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: IMiniUser
};
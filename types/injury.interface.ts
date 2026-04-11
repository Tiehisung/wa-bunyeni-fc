import { IMatch } from "./match.interface";
import { IMiniUser,   } from "./user";

export interface IInjury {
  _id?: string;
  player: {
    name: string;
    _id: string;
    avatar: string;
    number: string | number;
  };
  title: string;
  description?: string;
  severity: EInjurySeverity;

  //if occurred in match
  minute?: number | string;
  match?: IMatch

  createdBy?: IMiniUser
 
  createdAt?: string;
  updatedAt?: string;
}

export enum EInjurySeverity {
  MINOR = "MINOR",
  MODERATE = "MODERATE",
  SEVERE = "SEVERE",
  MAJOR = "MAJOR",
}
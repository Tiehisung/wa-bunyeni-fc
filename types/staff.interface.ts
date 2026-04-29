import { IMiniUser } from "./user";

export interface IStaff {
    email: string;
    dob: string;
    _id: string;
    avatar: string;
    role: string;
    fullname: string;
    dateSigned: string;
    phone: string;
    startDate: string;
    endDate: string;
    isActive: boolean
    createdBy?: IMiniUser
    createdAt: string; 
    updatedAt: string;
}
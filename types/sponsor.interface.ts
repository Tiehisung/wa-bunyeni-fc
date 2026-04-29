import type { IDonation } from "./donation.interface";
import { IMiniUser } from "./user";

export interface ISponsor {
    _id: string;
    badges: number;
    logo: string;
    businessName: string;
    businessDescription: string;
    name: string;
    phone: string;
    donations?: IDonation[];
    createdBy?: IMiniUser
    createdAt?: string;
    updatedAt?: string;
}
 
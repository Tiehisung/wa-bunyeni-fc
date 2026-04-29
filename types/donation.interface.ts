import type { ICloudinaryFile } from "./file.interface";
import type { ISponsor } from "./sponsor.interface";
import { IMiniUser } from "./user";



export interface IDonation {
    _id: string;
    item: string;
    description: string;
    files: ICloudinaryFile[];
    sponsor: ISponsor;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: IMiniUser
}

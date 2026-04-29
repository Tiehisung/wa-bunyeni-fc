import { IFileProps } from "@/types/file.interface";
import { IMiniUser } from "./user";

export interface IDocFile extends IFileProps {
    format: "pdf" | "image"|'video';
    folder: IFolder;
}
export interface IFolder {
    _id: string;
    name: string
    description?: string
    documents?: IDocFile[]
    isDefault?: boolean
    docsCount: number;
    createdAt?: string
    updatedAt?: string
    createdBy?: IMiniUser
}

 

 

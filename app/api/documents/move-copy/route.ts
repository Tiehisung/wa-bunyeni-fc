import { NextRequest, NextResponse } from "next/server";
import { logAction } from "../../logs/helper";
import DocModel from "@/models/doc";
import { IUser } from "@/types/user";
import { getErrorMessage } from "@/lib";
import { IFileProps } from "@/types/file.interface";
import FolderModel from "@/models/folder";

export interface IDocMoveCopy {
    file: IFileProps,
    actionType: 'Move' | 'Copy',
    destinationFolder: string
    user?: IUser,
}
export async function PUT(req: NextRequest) {
    try {
        const { file, actionType, destinationFolder } = await req.json() as IDocMoveCopy

        if (actionType == 'Move') {
            await DocModel.findByIdAndUpdate(file?._id, {
                $set: { folder: destinationFolder }
            });
            //Push to folder
            await FolderModel.findOneAndUpdate({
                name: destinationFolder,
            }, { $addToSet: { documents: file?._id } });
        } else {
            const { _id, ...docWithoutId } = file
            await DocModel.create({
                ...docWithoutId, folder: destinationFolder
            });
            //Push to folder
            await FolderModel.findOneAndUpdate({
                name: destinationFolder,
            }, { $addToSet: { documents: file?._id } });
        }

        // log
        await logAction({
            title: `${actionType} to ${destinationFolder} successful`,
            description: `${file.name ?? file.original_filename} '${actionType}' on ${Date.now()}` as string,
        });
        return NextResponse.json({
            success: true,
            message: `${actionType} successful`,

        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: getErrorMessage(error, `Failed `),
        });
    }
}

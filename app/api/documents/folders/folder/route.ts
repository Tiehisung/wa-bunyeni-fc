import { ConnectMongoDb } from "@/lib/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/lib";
import { logAction } from "../../../logs/helper";
import { deleteCldAssets } from "../../../file/route";
import { ELogSeverity } from "@/types/log";
import FolderModel, { IPostFolder } from "@/models/folder";
import { auth } from "@/auth";
import { EUserRole, IUser } from "@/types/user";
import DocModel from "@/models/doc";
import { IFolder } from "@/types/doc";

ConnectMongoDb();

export async function GET(request: NextRequest) {
    const folderId = request.nextUrl.searchParams.get('folderId');
    const folder = await FolderModel.findById(folderId)
        .populate('documents').lean();
    return NextResponse.json(folder);
}

export async function PUT(req: NextRequest) {
    try {
        const folderId = req.nextUrl.searchParams.get('folderId');

        console.log({ folderId })

        const foundFolder: (IPostFolder & { _id: string }) | null = await FolderModel.findById(folderId);
        if (!foundFolder) {
            return NextResponse.json({
                success: false,
                message: "Folder not found",
            });
        }

        const { ...data } = await req.json() as IPostFolder
        const { name, description, isDefault } = data;

        await FolderModel.findByIdAndUpdate(folderId, {
            $set: {
                ...data
            },
        });

        //Rename 'folder' of every containing doc file on database
        if (name && foundFolder.name !== name) {
            await DocModel.updateMany({
                _id: {
                    $in: foundFolder?.documents?.map((doc) => doc?._id?.toString()).filter(Boolean) ?? [],
                },

            },
                { $set: { folder: name } }
            );
        }



        let title = ''
        let desc = ''
        let defaultChangedMsg = ' '

        if (name && foundFolder.name !== name) {
            title += `Name changed from ${foundFolder.name} to ${name}. `

        }
        if (description && foundFolder.description !== description) {
            desc += `Description changed from ${foundFolder.description} to ${description}. `
        }
        if (foundFolder.isDefault !== isDefault) {
            defaultChangedMsg = isDefault ? `Folder made default  ` : 'Folder changed from being system default';
        }

        // log
        await logAction({
            title: title || ` Folder [${name}] updated.`,
            description: desc + defaultChangedMsg,
        });
        return NextResponse.json({
            success: true,
            message: "Folder Updated",

        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: getErrorMessage(error, "Failed to update folder"),
        });
    }
}

//Delete from Cloud then pull id from collection files field
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        const folderId = request.nextUrl.searchParams.get('folderId');

        if ((session?.user as IUser)?.role !== EUserRole.SUPER_ADMIN) {
            return NextResponse.json({
                message: "Unauthorized",
                success: false,
            });
        }

        console.log({ folderId })
        const deletedFolder: IFolder = await FolderModel.findByIdAndDelete(folderId).populate('documents');

        //Delete file from cloudinary
        await deleteCldAssets(deletedFolder?.documents
            ?.map((doc) => ({ public_id: doc.public_id })) ?? []);

        //Delete file data from database
        const deleteFromDb = await DocModel.deleteMany({
            _id: {
                $in: deletedFolder?.documents?.map(doc => doc._id).filter(Boolean) ?? [],
            }
        });
        // log
        const logDesc = deletedFolder?.documents?.length ? `${deletedFolder?.documents?.length} docs deleted. [${deletedFolder?.documents?.map(dd => dd.name)?.join(', ')}].` : 'No documents to delete.';
        await logAction({
            title: "Folder deleted",
            description: logDesc,
            severity: ELogSeverity.CRITICAL,
        });
        return NextResponse.json({
            message: "Folder deleted ",
            success: true,
            data: deleteFromDb,
        });
    } catch (error) {
        return NextResponse.json({
            message: "Failed to delete file.",
            success: false,
            data: error,
        });
    }
}
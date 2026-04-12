import { getErrorMessage, removeEmptyKeys } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import GalleryModel from "@/models/galleries";
import FileModel from "@/models/file";
import { NextRequest, NextResponse } from "next/server";
import { IGallery } from "@/types/file.interface";
import { auth } from "@/auth";

ConnectMongoDb();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("gallery_search") || "";
    const tags = (searchParams.get("tags") || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const skip = (page - 1) * limit;
    const regex = new RegExp(search, "i");

    // Build Query Object
    const query: Record<string, unknown> = {};

    if (tags.length > 0) {
      query.tags = { $in: tags };
    }

    if (search) {
      query.$or = [
        { title: regex },
        { description: regex },
        { tags: regex },
      ];
    }

    const cleaned = removeEmptyKeys(query);

    // Apply filters here
    const galleries = await GalleryModel.find(cleaned)
      .populate("files")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await GalleryModel.countDocuments(cleaned);

    return NextResponse.json({
      success: true,
      data: galleries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const { files, tags, title, description, } = (await request.json()) as IGallery;

    //Save files to File collection
    const savedFiles = await FileModel.insertMany(files);
    const fileIds = savedFiles.map(file => file._id);

    const session = await auth()

    //Create gallery with saved file IDs
    const savedGallery = await GalleryModel.create({
      files: fileIds, tags, title, description,
      timestamp: Date.now(),
      createdBy: session?.user
    });

    if (!savedGallery)
      return NextResponse.json({
        message: "Failed to create gallery",
        success: false,
        data: savedGallery,
      });


    return NextResponse.json({
      message: "Gallery created",
      success: true,
      data: savedGallery,
    });
  } catch (error) {
    return NextResponse.json({
      message: getErrorMessage(error, "Failed to save gallery"),
      success: false,
    });
  }
}



import { getErrorMessage } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import ArchiveModel from "@/models/Archives";
import GalleryModel from "@/models/galleries";
import MatchModel from "@/models/match";
import NewsModel from "@/models/news";
import PlayerModel from "@/models/player";
import SponsorModel from "@/models/sponsor";
import SquadModel from "@/models/squad";
import TeamModel from "@/models/teams";
import UserModel from "@/models/user";
import { IRecord } from "@/types";
import { EArchivesCollection } from "@/types/archive.interface";
import { NextRequest, NextResponse } from "next/server";


ConnectMongoDb();

export async function POST(request: NextRequest) {
  const { sourceCollection, dataId } = await request.json();

  try {
    //Remove from archives

    const dataDoc = await ArchiveModel.findOne({ sourceCollection });

    if (!dataDoc) {
      return NextResponse.json({
        message: "No archived data found",
        success: false,
      });
    }

    const dataItem = dataDoc.data.find((item: IRecord) => item?._id?.toString() === dataId);

    if (!dataItem) {
      return NextResponse.json({
        message: "Data item not found in archives",
        success: false,
      });
    }
    const targetData = { ...dataItem };

    const filtered = dataDoc.data.filter(
      (item: IRecord) => item?._id?.toString() !== dataId
    );


    await ArchiveModel.updateOne(
      { sourceCollection },
      { $set: { data: filtered } }
    );

    switch (sourceCollection as EArchivesCollection) {
      case EArchivesCollection.NEWS:
        //Return item to its former collection
        let restored = await NewsModel.create(targetData);
        if (restored)
          return NextResponse.json({
            message: "News item restored",
            success: true,
          });
        break;
      case EArchivesCollection.PLAYERS:
        restored = await PlayerModel.create(dataItem);
        if (restored)
          return NextResponse.json({
            message: "Player restored",
            success: true,
          });
        break;
      case EArchivesCollection.GALLERIES:
        restored = await GalleryModel.create(dataItem);
        if (restored)
          return NextResponse.json({
            message: "Gallery restored",
            success: true,
          });
        break;
      case EArchivesCollection.MATCHES:
        restored = await MatchModel.create(dataItem);
        if (restored)
          return NextResponse.json({
            message: "Match restored",
            success: true,
          });
        break;
      case EArchivesCollection.SQUADS:
        restored = await SquadModel.create(dataItem);
        if (restored)
          return NextResponse.json({
            message: "Squad restored",
            success: true,
          });
        break;
      case EArchivesCollection.TEAMS:
        restored = await TeamModel.create(dataItem);
        if (restored)
          return NextResponse.json({
            message: "Team restored",
            success: true,
          });
        break;
      case EArchivesCollection.USERS:
        restored = await UserModel.create(dataItem);
        if (restored)
          return NextResponse.json({
            message: "User restored",
            success: true,
          });
        break;
      case EArchivesCollection.SPONSORS:
        restored = await SponsorModel.create(dataItem);
        if (restored)
          return NextResponse.json({
            message: "Sponsor restored",
            success: true,
          });
        break;
      default:
        return NextResponse.json({
          message: "Specify restore collection",
          success: false,
        });
    }
  } catch (error) {
    return NextResponse.json({
      message: getErrorMessage(error),
      success: false,
    });
  }
}

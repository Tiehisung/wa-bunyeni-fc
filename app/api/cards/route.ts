import { getErrorMessage } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import { logAction } from "../logs/helper";
import CardModel from "@/models/card";
import { updateMatchEvent } from "../matches/live/events/route";
import PlayerModel from "@/models/player";
import { auth } from "@/auth";
import { ICard } from "@/types/card.interface";

ConnectMongoDb();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1", 10);

  const limit = Number.parseInt(searchParams.get("limit") || "30", 10);
  const skip = (page - 1) * limit;

  const search = searchParams.get("card_search") || "";

  const regex = new RegExp(search, "i");

  const query = {
    $or: [
      { "type": regex },
      { "player.name": regex },
      { "match.name": regex },
      { "description": regex },
    ],
  }

  const cards = await CardModel.find(query)
    .limit(limit).skip(skip)
    .lean().sort({ createdAt: "desc" });

  const total = await CardModel.countDocuments(query)
  return NextResponse.json({
    success: true,
    data: cards,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { match, minute, player, type, description, } = await request.json() as ICard;

    const savedCard = await CardModel.create({
      match, minute, player, type
    });

    if (!savedCard) {
      return NextResponse.json({ message: "Failed to create card.", success: false });
    }

    //Update Player
    await PlayerModel.findByIdAndUpdate(player?._id, { $push: { cards: savedCard._id } })

    //Update events
    await updateMatchEvent(match?._id as string, {
      type: 'card',
      minute: minute as string,
      title: `${type == 'red' ? '🟥' : '🟨'} ${minute}' - ${player?.number}  ${player?.name} `,
      description
    })

    // log
    await logAction({
      title: "Card Created",
      description: `${type == 'red' ? '🟥' : '🟨'} ${type} card recorded. ${description || ''}`,
    });

    return NextResponse.json({ message: "Card created successfully!", success: true, data: savedCard });

  } catch (error) {
    return NextResponse.json({
      message: getErrorMessage(error),
      success: false,
    });
  }
}


export async function DELETE(request: NextRequest) {
  try {
    const { cardId, playerId, matchId } = await request.json() as { cardId: string, playerId: string, matchId: string }

    const deleted = await CardModel.findByIdAndDelete(cardId,);

    if (!deleted) {
      return NextResponse.json({ message: "Failed to delete card.", success: false });
    }

    //Update Player
    await PlayerModel.findByIdAndUpdate(playerId, { $pull: { cards: cardId } })

    //Update events
    await updateMatchEvent(matchId, {
      type: 'card',
      minute: deleted?.minute,
      title: ` Card revoked `,
      description: 'Card reviewed and revoked'
    })

    // log
    await logAction({
      title: "Card deleted",
      description: `Recent card was revoked`,
    });

    return NextResponse.json({ message: "Card created successfully!", success: true, data: deleted });

  } catch (error) {
    return NextResponse.json({
      message: getErrorMessage(error),
      success: false,
    });
  }
}

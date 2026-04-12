
import { checkMatchMetrics } from "@/lib/compute/match";
import { ConnectMongoDb } from "@/lib/dbconfig";
import MatchModel from "@/models/match";
import PlayerModel from "@/models/player";
import { IMatch, IMatchMetrics, } from "@/types/match.interface";
import { EPlayerStatus } from "@/types/player.interface";
import { NextRequest, NextResponse } from "next/server";


ConnectMongoDb();

export async function GET(request: NextRequest) {
  ConnectMongoDb();
  const matches = await MatchModel.find({ status: 'FT' }).populate('opponent').populate('goals') as IMatch[];

  const matchMetrics = matches?.map(m => checkMatchMetrics(m));

  const matchStats = {
    wins: matchMetrics?.filter(m => m?.winStatus == 'win'),
    draws: matchMetrics?.filter(m => m?.winStatus == 'draw'),
    losses: matchMetrics?.filter(m => m?.winStatus == 'loss'),
  }
  const winRate = (((matchStats?.wins?.length ?? 0) / (matchMetrics?.length ?? 1)) * 100)?.toPrecision(1)

  const goals = matchMetrics?.map(mm => mm.goals.kfc).flat().length ?? 0

  const total = await PlayerModel.countDocuments({ status: EPlayerStatus.CURRENT })

  return NextResponse.json({
    success: true,
    data: {
      activePlayers: total,
      matchStats: {
        ...matchStats,
        winRate,
        metrics: matchMetrics,
        totalMatches: matchMetrics.length ?? 0,
        goals
      },
    },

  });
}

export interface IMetrics {
  activePlayers: number;
  matchStats: {
    winRate: string;
    metrics: IMatchMetrics[];
    totalMatches: number;
    goals: number;
    wins: IMatchMetrics[];
    draws: IMatchMetrics[];
    losses: IMatchMetrics[];
  };
}
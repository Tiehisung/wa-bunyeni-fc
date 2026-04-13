import "@/models/file";
import "@/models/galleries";
// app/api/players/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';
import bcrypt from 'bcryptjs';
import PlayerModel from '@/models/player';
import UserModel from '@/models/user';
import { formatDate, getAgeFromDOB } from '@/lib/timeAndDate';
import { generatePlayerAbout } from '@/data/about';
import { EPlayerAgeStatus, EPlayerStatus, } from '@/types/player.interface';
import { IPostPlayer } from "@/app/admin/players/new/NewSigningForms";
import { getInitials, removeEmptyKeys } from "@/lib";
import { EUserRole } from "@/types/user";
import { LoggerService } from "../../../shared/log.service";
import { getApiErrorMessage } from "../../../lib/error-api";
import { slugify } from "@/lib/slugging";

connectDB();

// Helper function to generate player ID
export const generatePlayerID = (
  firstName: string,
  lastName: string,
  dob: string | Date,
  format: 'ymd' | 'ydm' | 'dmy' | 'dym' | 'mdy' | 'myd' = 'dmy'
) => {
  const initials = getInitials([firstName, lastName], 2);
  const date = formatDate(dob, 'dd/mm/yyyy');
  const dmy = date.split('/').reverse();

  const codes = {
    dmy: dmy[2] + dmy[1] + dmy[0].substring(2),
    dym: dmy[2] + dmy[0].substring(2) + dmy[1],
    mdy: dmy[1] + dmy[2] + dmy[0].substring(2),
    myd: dmy[1] + dmy[0].substring(2) + dmy[2],
    ydm: dmy[0].substring(2) + dmy[2] + dmy[1],
    ymd: dmy[0].substring(2) + dmy[1] + dmy[2],
  };

  return initials.toUpperCase() + codes[format];
};

// GET /api/players - List all players
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '30');
    const skip = (page - 1) * limit;

    const search = searchParams.get('player_search') || '';
    const status = searchParams.get('status') || EPlayerStatus.CURRENT;

    const regex = new RegExp(search, 'i');

    const query: any = {
      $or: [
        { firstName: regex },
        { lastName: regex },
        { position: regex },
        { number: regex },
        { dob: regex },
        { email: regex },
        { status: regex },
      ],
      status,
    };

    const cleaned = removeEmptyKeys(query);

    const players = await PlayerModel.find(cleaned)
      .populate({
        path: 'galleries',
        populate: { path: 'files' }
      })
      .populate('createdBy', 'name role')
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await PlayerModel.countDocuments(cleaned);

    return NextResponse.json({
      success: true,
      data: players,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    LoggerService.error('Failed to fetch players', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch players'),
    }, { status: 500 });
  }
}

// POST /api/players - Create new player
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const pf = await request.json() as IPostPlayer;

    // Ensure unique code
    let playerCode = generatePlayerID(pf.firstName, pf.lastName, pf.dob);

    const existingPlayerByCode = await PlayerModel.findOne({ code: playerCode });

    if (existingPlayerByCode) {
      playerCode = getInitials([pf.firstName, pf.lastName], 2) + Date.now();
    }

    const slug = slugify(`${pf.firstName}-${pf.lastName}-${playerCode}`);

    const email = (pf.email || `${playerCode}@bnfc.com`).toLowerCase();

    const existingPlayerByEmail = await PlayerModel.findOne({ email });

    if (existingPlayerByEmail) {
      return NextResponse.json({
        message: `Duplicate email found - ${email}`,
        success: false,
      }, { status: 409 });
    }

    const ageStatus = getAgeFromDOB(pf.dob) < 10 ? EPlayerAgeStatus.JUVENILE : EPlayerAgeStatus.YOUTH;
    const about = pf.about || generatePlayerAbout(pf.firstName, pf.lastName, pf.position);

    const newPlayer = await PlayerModel.create({
      ...pf,
      slug,
      code: playerCode,
      email,
      about,
      ageStatus,
      createdBy: session.user?.id
    });

    // Create User account for player
    const existingUser = await UserModel.findOne({ email: pf.email });

    if (!existingUser) {
      const password = await bcrypt.hash('bunyenifc', 10);

      await UserModel.create({
        email,
        name: `${pf.lastName} ${pf.firstName}`,
        image: pf.avatar,
        lastLoginAccount: 'credentials',
        password,
        role: EUserRole.PLAYER,
        about
      });
    }

    return NextResponse.json({
      message: 'Player Added',
      success: true,
      data: newPlayer,
    }, { status: 201 });
  } catch (error) {
    LoggerService.error('Failed to create player', error);
    return NextResponse.json({
      message: getApiErrorMessage(error),
      success: false,
    }, { status: 500 });
  }
}
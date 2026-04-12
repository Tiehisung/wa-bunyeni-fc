import "@/models/file";
import "@/models/galleries";

import { ConnectMongoDb } from "@/lib/dbconfig";
import PlayerModel from "@/models/player";
import { NextRequest, NextResponse } from "next/server";
import { getAge, getErrorMessage, getInitials, removeEmptyKeys, slugify } from "@/lib";
import UserModel from "@/models/user";
import bcrypt from "bcryptjs";
import { EUserRole } from "@/types/user";
import { formatDate } from "@/lib/timeAndDate";
import { EPlayerAgeStatus, EPlayerStatus, IPostPlayer } from "@/types/player.interface";
import { generatePlayerAbout } from "@/data/about";

ConnectMongoDb();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1", 10);

  const ageStatus = searchParams.get("ageStatus") || EPlayerAgeStatus.YOUTH

  const limit = Number.parseInt(searchParams.get("limit") || "30", 10);
  const skip = (page - 1) * limit;

  const search = searchParams.get("player_search") || "";
  const field = searchParams.get("field") || "";
  const value = searchParams.get("value") || "";

  const status = searchParams.get("status") || EPlayerStatus.CURRENT

  const regex = new RegExp(search, "i");

  const query = {
    $or: [
      { "firstName": regex },
      { "lastName": regex },
      { "position": regex },
      { "number": regex },
      { "dob": regex },
      { "email": regex },
      { "status": regex },
    ],
    status,
    ageStatus,
    // [field]: value
  }
  const cleaned = removeEmptyKeys(query)
  const players = await PlayerModel.find(cleaned)
    .populate({ path: "galleries", populate: { path: 'files' } }).skip(skip)
    .limit(limit)
    .lean();

  const total = await PlayerModel.countDocuments(cleaned)
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
}

export async function POST(request: NextRequest) {
  const pf = (await request.json()) as IPostPlayer;
  try {
    //Ensure unique code ----------------------------------------

    let playerCode = generatePlayerID(pf.firstName, pf.lastName, pf.dob)

    const existingPlayerByCode = await PlayerModel.findOne({ code: playerCode });

    if (existingPlayerByCode) {
      playerCode = getInitials([pf.firstName, pf.lastName], 2) + (new Date()).getMilliseconds()
    }

    const slug = slugify(`${pf.firstName}-${pf.lastName}-${playerCode}`,)
    //--------------------------------------------------------------------------------

    const email = (pf.email || `${playerCode}@kfc.com`).toLowerCase()

    const existingPlayerByEmail = await PlayerModel.findOne({ email });

    if (existingPlayerByEmail)
      return NextResponse.json({
        message: `Duplicate email found - ${email}`,
        success: false
      });

    const ageStatus = getAge(pf.dob) < 10?EPlayerAgeStatus.JUVENILE:EPlayerAgeStatus.YOUTH

    const about = pf.about || generatePlayerAbout(pf.firstName, pf.lastName, pf.position)

    await PlayerModel.create({ ...pf, slug, code: playerCode, email, about, ageStatus });


    // Create User
    const existingUser = await UserModel.findOne({ email: pf.email });

    if (!existingUser) {
      const password = await bcrypt.hash('kfc', 10);

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
    return NextResponse.json({ message: "Player Added", success: true });
  } catch (error) {
    return NextResponse.json({ message: getErrorMessage(error), success: false, data: error });
  }
}

export const generatePlayerID = (firstName: string, lastName: string, dob: string | Date, format: 'ymd' | 'ydm' | 'dmy' | 'dym' | 'mdy' | 'myd' = 'dmy') => {
  const initials = getInitials([firstName, lastName], 2)
  const date = formatDate(dob, 'dd/mm/yyyy')
  const dmy = date.split('/').reverse()

  const codes = {
    dmy: dmy[2] + dmy[1] + dmy[0].substring(2),
    dym: dmy[2] + dmy[0].substring(2) + dmy[1],
    mdy: dmy[2] + dmy[1] + dmy[0].substring(2),
    myd: dmy[2] + dmy[0].substring(2) + dmy[1],
    ydm: dmy[0].substring(2) + dmy[2] + dmy[1],
    ymd: dmy[0].substring(2) + dmy[1] + dmy[2],
  }

  return initials.toUpperCase() + codes[format]
}

import "@/models/file";
import "@/models/galleries";
// app/api/players/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/db.config";

import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import PlayerModel from "@/models/player";
import UserModel from "@/models/user";
import { generatePlayerAbout } from "@/data/about";
import { EPlayerAgeCategory, EPlayerStatus } from "@/types/player.interface";
import { IPostPlayer } from "@/app/admin/players/new/NewSigningForms";
import { getInitials, removeEmptyKeys } from "@/lib";
import { EUserRole } from "@/types/user";
import { LoggerService } from "../../../shared/log.service";
import { getApiErrorMessage } from "../../../lib/error-api";
import { slugify } from "@/lib/slugging";
import { authorizeOrResponse } from "../auth/authorization";
import { generatePlayerCode } from "./code";

connectDB();

const CATEGORY_AGE_LIMITS: Record<
  EPlayerAgeCategory,
  { min: number; max: number }
> = {
  [EPlayerAgeCategory.U13]: { min: 10, max: 13 },
  [EPlayerAgeCategory.U15]: { min: 13, max: 15 },
  [EPlayerAgeCategory.U17]: { min: 15, max: 17 },
  [EPlayerAgeCategory.U20]: { min: 17, max: 20 },
  [EPlayerAgeCategory.SENIOR]: { min: 18, max: 99 },
};

function getAgeRangeForCategory(
  category: EPlayerAgeCategory,
): { $gte: number; $lte: number } | null {
  const limits = CATEGORY_AGE_LIMITS[category];
  if (!limits) return null;
  return { $gte: limits.min, $lte: limits.max };
}

function buildCategoryQuery(category: string): { $expr?: any } | null {
  if (!category) return null;

  const validCategory = Object.values(EPlayerAgeCategory).find(
    (c) => c === category,
  );

  if (!validCategory) return null;

  const ageRange = getAgeRangeForCategory(validCategory);
  if (!ageRange) return null;

  // Calculate birthdate range based on age
  const currentYear = new Date().getFullYear();
  const maxBirthYear = currentYear - ageRange.$gte;
  const minBirthYear = currentYear - ageRange.$lte;

  return {
    $expr: {
      $and: [
        // ✅ Convert string to date first, then extract year
        { $gte: [{ $year: { $toDate: "$dob" } }, minBirthYear] },
        { $lte: [{ $year: { $toDate: "$dob" } }, maxBirthYear] },
      ],
    },
  };
}

// GET /api/players - List all players
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const skip = (page - 1) * limit;

    const search = searchParams.get("player_search") || "";
    const status = searchParams.get("status") || EPlayerStatus.CURRENT;
    const category = searchParams.get("category") || ""; // New: u8, u10, u12, u13, u15, u17, u20, senior
    const position = searchParams.get("position") || "";
    const regex = new RegExp(search, "i");

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
    if (position) {
      query.position = position;
    }

    const categoryQuery = buildCategoryQuery(category);
    if (categoryQuery) {
      Object.assign(query, categoryQuery);
    }

    const cleaned = removeEmptyKeys(query);
    console.log(cleaned, categoryQuery);

    const players = await PlayerModel.find(cleaned)
      .populate({
        path: "galleries",
        populate: { path: "files" },
      })
      .populate("createdBy", "name role")
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true });

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
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: getApiErrorMessage(error, "Failed to fetch players"),
      },
      { status: 500 },
    );
  }
}

// POST /api/players - Create new player
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    authorizeOrResponse(session?.user?.role, EUserRole.ADMIN);

    const pf = (await request.json()) as IPostPlayer;

    // Ensure unique code
    let playerCode = await generatePlayerCode(pf.firstName, pf.lastName);

    const existingPlayerByCode = await PlayerModel.findOne({
      code: playerCode,
    });

    if (existingPlayerByCode) {
      playerCode = getInitials([pf.firstName, pf.lastName], 2) + Date.now();
    }

    const slug = slugify(`${pf.firstName}-${pf.lastName}-${playerCode}`);

    const email = (pf.email || `${playerCode}@bfc.com`).toLowerCase();

    const existingPlayerByEmail = await PlayerModel.findOne({ email });

    if (existingPlayerByEmail) {
      return NextResponse.json(
        {
          message: `Duplicate email found - ${email}`,
          success: false,
        },
        { status: 409 },
      );
    }

    const about =
      pf.about || generatePlayerAbout(pf.firstName, pf.lastName, pf.position);

    const newPlayer = await PlayerModel.create({
      ...pf,
      slug,
      code: playerCode,
      email,
      about,
      createdBy: session?.user,
    });

    // Create User account for player
    const existingUser = await UserModel.findOne({ email: pf.email });

    if (!existingUser) {
      const password = await bcrypt.hash("1234", 10);

      await UserModel.create({
        email,
        name: `${pf.lastName} ${pf.firstName}`,
        image: pf.avatar,
        lastLoginAccount: "credentials",
        password,
        role: EUserRole.PLAYER,
        about,
      });
    }

    return NextResponse.json(
      {
        message: "Player Added",
        success: true,
        data: newPlayer,
      },
      { status: 201 },
    );
  } catch (error) {
    LoggerService.error("Failed to create player", error);
    return NextResponse.json(
      {
        message: getApiErrorMessage(error),
        success: false,
      },
      { status: 500 },
    );
  }
}

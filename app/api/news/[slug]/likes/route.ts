// app/api/news/[slug]/likes/route.ts
import { NextRequest, NextResponse } from "next/server";
import NewsModel from "@/models/news";
import { slugIdFilters } from "@/lib/slug";
import { getApiErrorMessage } from "@/lib/error-api";
import connectDB from "@/config/db.config";
import { auth } from "@/auth";
import { getOrCreateVisitorId } from "@/lib/visitor";
import { updateFanPoints } from "@/app/api/fans/helpers";

connectDB();

// PATCH /api/news/[slug]/likes - Update news likes
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await auth();
    const user = session?.user;
    const { slug } = await params;
    const filter = slugIdFilters(slug);
    const visitorId = await getOrCreateVisitorId();

    const news = await NewsModel.findOne(filter);
    if (!news) {
      return NextResponse.json(
        {
          success: false,
          message: "News not found",
        },
        { status: 404 },
      );
    }

    // ✅ Separate logic for authenticated vs anonymous users
    let existingLike = null;

    if (user?._id) {
      // Authenticated user: find by user ID only
      existingLike = news.likes?.find(
        (like: any) => like.user?._id?.toString() === user._id.toString(),
      );
    } else {
      // Anonymous user: find by visitorId only
      existingLike = news.likes?.find(
        (like: any) => like.visitorId === visitorId && !like.user?._id,
      );
    }

    if (existingLike) {
      // ✅ UNLIKE
      await NewsModel.findOneAndUpdate(filter, {
        $pull: { likes: { _id: existingLike._id } },
        $inc: { "stats.likeCount": -1 },
        $set: { "stats.lastTrendingUpdate": new Date() },
      });

      // Remove fan points (if they had earned any)
      if (user?._id) {
        await updateFanPoints(user as IMiniUser, "reaction", true);
      }

      return NextResponse.json({
        success: true,
        message: "Unliked successfully",
        data: { liked: false },
      });
    } else {
      // ✅ LIKE
      const newLike = {
        user: session?.user,
        visitorId: visitorId,
      };

      await NewsModel.findOneAndUpdate(filter, {
        $push: { likes: newLike },
        $inc: { "stats.likeCount": 1 },
        $set: { "stats.lastTrendingUpdate": new Date() },
      });

      if (user?._id) {
        await updateFanPoints(user as IMiniUser, "reaction");
      }

      return NextResponse.json({
        success: true,
        message: "Liked successfully",
        data: { liked: true },
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: getApiErrorMessage(error, "Failed to update like"),
      },
      { status: 500 },
    );
  }
}

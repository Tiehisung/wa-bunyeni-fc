import { ENV } from "@/lib/env";
import mongoose, { Schema } from "mongoose";
import { MiniUserSchema } from "./user";

const newsSchema = new Schema(
  {
    slug: { type: String, required: [true, "Slug is required"], unique: true },
    headline: {
      text: { type: String, required: [true, "Headline text required"] },
      image: {
        type: String,
        required: [true, "Wall image for headline required"],
      },
    },
    source: {
      type: Schema.Types.Mixed,
      default: ENV.APP_URL,
    },
    details: [
      {
        text: String,
        media: [{}],
      },
    ],
    type: {
      type: String
      , enum: ['general', 'squad', 'fixture', 'match', 'training',],
      default: 'general'
    },
    metaDetails: {}, //ISquad etc

    isPublished: Boolean,

    likes: [{
      user: MiniUserSchema,
      visitorId: String,
      date: { type: String, default: () => new Date().toISOString() },
    }],
    comments: [{
      user: MiniUserSchema,
      visitorId: String,
      date: { type: String, default: () => new Date().toISOString() },
      updatedAt: { type: String, default: () => new Date().toISOString() },
      comment: String
    }],
    views: [{
      user: MiniUserSchema,
      visitorId: String,
      date: { type: String, default: () => new Date().toISOString() },
    }],
    shares: {
      type: [{
        user: MiniUserSchema,
        visitorId: String,
        date: { type: String, default: () => new Date().toISOString() },
      }],
      default: () => []
    },

    status: {
      type: String,
      default: 'unpublished', enum: ['published', 'unpublished', 'archived']
    },
    stats: {
      viewCount: { type: Number, default: 0 },
      likeCount: { type: Number, default: 0 },
      commentCount: { type: Number, default: 0 },
      shareCount: { type: Number, default: 0 },
      trendingScore: { type: Number, default: 0 },
      lastTrendingUpdate: { type: Date, default: Date.now },
    },
    editors: [{ email: String, name: String, avatar: String, role: String, about: String, date: { type: String, default: () => new Date().toISOString() } }],
    createdBy: MiniUserSchema //As IUser
  },
  { timestamps: true }
);


// Indexes for better query performance
newsSchema.index({ createdAt: -1 });
newsSchema.index({ tags: 1 });
newsSchema.index({ type: 1 });
newsSchema.index({ isPublished: 1 });
newsSchema.index({ 'stats.trendingScore': -1 });


const NewsModel = mongoose.models.news || mongoose.model("news", newsSchema);
export default NewsModel;


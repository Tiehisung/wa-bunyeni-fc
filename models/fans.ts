// models/fan.model.ts
import { EFanBadge } from "@/types/fan.interface";
import mongoose, { Schema } from "mongoose";

const FanSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    badges: [
      {
        type: String,
        enum: Object.values(EFanBadge),
        default: [],
      },
    ],
    rank: {
      type: Number,
      default: null,
    },
    engagementScore: {
      type: Number,
      default: 0,
    },
    contributions: {
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      reactions: { type: Number, default: 0 },
      matchAttendance: { type: Number, default: 0 },
      galleries: { type: Number, default: 0 },
      newsViews: { type: Number, default: 0 },
    },
    fanSince: {
      type: Date,
      default: Date.now,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    preferences: {
      notifications: { type: Boolean, default: true },
      favoritePlayer: { type: String },
      favoriteTeam: { type: String },
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for performance
FanSchema.index({ points: -1 });
FanSchema.index({ engagementScore: -1 });
// FanSchema.index({ user: 1 }, { unique: true });

const FanModel = mongoose.models.fans || mongoose.model("fans", FanSchema);

export default FanModel;

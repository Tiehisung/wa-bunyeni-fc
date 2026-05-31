import { computeMatchResult } from "@/app/api/matches/helpers";
import {
  EMatchCategory,
  EMatchLocation,
  EMatchStatus,
} from "@/types/match.interface";
import mongoose, { Schema } from "mongoose";

const matchSchema = new Schema(
  {
    title: { type: String },
    slug: { type: String, unique: [true, "Slug must be unique"] },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: [...Object.values(EMatchStatus)],
      default: () => EMatchStatus.UPCOMING,
    },
    location: {
      type: String,
      enum: [...Object.values(EMatchLocation)],
      default: () => EMatchLocation.HOME,
    },
    category: {
      type: String,
      enum: [...Object.values(EMatchCategory)],
      default: () => EMatchCategory.U13,
    },
    opponent: { type: Schema.Types.ObjectId, ref: "teams", required: true },
    goals: [{ type: Schema.Types.ObjectId, ref: "goals" }],
    squad: { type: Schema.Types.ObjectId, ref: "squad" },
    cards: [{ type: Schema.Types.ObjectId, ref: "cards" }],
    injuries: [{ type: Schema.Types.ObjectId, ref: "injuries" }],

    sponsor: [{ type: Schema.Types.ObjectId, ref: "sponsors" }],
    broadcaster: {},
    venue: { type: String, default: () => "Konjiehi Park" },
    venueImages: { type: [String], default: () => [] },
    matchImages: { type: [String], default: () => [] },

    competition: { type: String, default: () => "Friendly" },
    isHome: Boolean,
    events: [
      {
        description: String,
        title: String,
        minute: String,
        modeOfScore: String,
      },
    ],
    mvp: {}, //iplayer preferred
    fixtureFlier: String,
    resultFlier: String,
    createdBy: { _id: String, name: String, avatar: String }, //As IUser
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

matchSchema.virtual("computed").get(function () {
  return computeMatchResult(this as any);
});

const MatchModel =
  mongoose.models.matches || mongoose.model("matches", matchSchema);

export default MatchModel;

export type IPostMatch = mongoose.InferSchemaType<typeof matchSchema>;

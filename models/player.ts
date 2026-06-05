import {
  EPlayerStatus,
  EPlayerAvailability,
  EPlayerAgeCategory,
} from "@/types/player.interface";
import mongoose, { Schema } from "mongoose";
import { fileSchema } from "./file";
import { getAgeFromDOB } from "@/lib/timeAndDate";

const playerSchema = new Schema(
  {
    slug: { type: String, unique: [true, "Player with slug already exists"] },
    firstName: {
      type: String,
      required: true,
      message: "First name required",
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      message: "Last name required",
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      message: "Phone number required",
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true; // skip validation if empty
          return /\S+@\S+\.\S+/.test(v); // check format if exists
        },
        message: "Email must be valid",
      },
    },
    avatar: String,
    height: { type: Number },
    captaincy: { type: String },
    dob: { type: String, required: true },
    about: { type: String },
    history: { type: String },
    dateSigned: { type: String, required: true },
    featureMedia: { type: [fileSchema], default: () => [] },
    manager: {
      fullname: String,
      phone: String,
    },
    performance: { type: Schema.Types.Array, default: () => [] },

    galleries: [{ type: Schema.Types.ObjectId, ref: "galleries", default: [] }],
    cards: [{ type: Schema.Types.ObjectId, ref: "cards", default: [] }],
    injuries: [{ type: Schema.Types.ObjectId, ref: "injuries", default: [] }],
    goals: [{ type: Schema.Types.ObjectId, ref: "goals", default: [] }],
    assists: [{ type: Schema.Types.ObjectId, ref: "goals", default: [] }],
    ratings: [
      {
        match: { type: Schema.Types.ObjectId, ref: "matches" },
        rating: Number,
        default: [],
      },
    ],
    matches: [{ type: Schema.Types.ObjectId, ref: "matches", default: [] }],
    mvps: [{ type: Schema.Types.ObjectId, ref: "mvps", default: [] }],

    issues: {
      type: [
        {
          title: String,
          description: String,
          date: { type: String, default: () => new Date().toISOString() },
        },
      ],
      default: () => [],
    },
    status: {
      type: String,
      enum: Object.values(EPlayerStatus),
      default: () => EPlayerStatus.CURRENT,
    },
    availability: {
      type: String,
      default: () => EPlayerAvailability.AVAILABLE,
      enum: Object.values(EPlayerAvailability),
    },

    number: { type: String },
    position: {
      type: String,
    },
    training: { type: Schema.Types.Mixed, default: () => ({ team: "A" }) },
    code: {
      type: String,
      required: [true, "Player ID is required"],
      unique: [true, "Player ID must be a unique value"],
    }, //IS091223
    createdBy: { _id: String, name: String, avatar: String }, //As IUser
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // ✅ Include virtuals in JSON output
    toObject: { virtuals: true }, // ✅ Include virtuals in object output
  },
);

// 🔥 Virtual that calculates category from DOB
playerSchema.virtual("category").get(function () {
  const age = getAgeFromDOB(this.dob);

  if (age <= 13) return EPlayerAgeCategory.U13;
  if (age <= 15) return EPlayerAgeCategory.U15;
  if (age <= 17) return EPlayerAgeCategory.U17;
  if (age <= 20) return EPlayerAgeCategory.U20;
  return EPlayerAgeCategory.SENIOR;
});

// Optional: Add age virtual too
playerSchema.virtual("age").get(function () {
  return getAgeFromDOB(this.dob);
});

const PlayerModel =
  mongoose.models.players || mongoose.model("players", playerSchema);

export default PlayerModel;

// email: {
//   type: String,
//     trim: true,
//       lowercase: true,
//         validate: {
//     validator: function (v: string) {
//       if (!v) return true; // skip validation if empty
//       return /\S+@\S+\.\S+/.test(v); // check format if exists
//     },
//     message: "Email must be valid",
//       },
// }

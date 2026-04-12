import { EInjurySeverity } from "@/types/injury.interface";
import mongoose, { Schema } from "mongoose";

export const injurySchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    minute: String,
    player: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "players",
        required: true
      },
      name: String,
      avatar: String,
      number: Number
    },
    severity: { type: String, enum: Object.values(EInjurySeverity), default: EInjurySeverity.MINOR },
    match: {},
    user: {},
  },
  { timestamps: true }
);

const InjuryModel = mongoose.models.injuries || mongoose.model("injuries", injurySchema);

export default InjuryModel;

export type IPostInjury = mongoose.InferSchemaType<typeof injurySchema>;
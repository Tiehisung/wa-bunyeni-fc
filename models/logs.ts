
import { ELogSeverity, ILog } from "@/types/log.interface";
import mongoose, { Schema } from "mongoose";
 

const logSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [3, "Title must be at least 3 characters long"],
      trim: true,
    },

    description: String,

    // store the user email that triggered this log
    user: {},

    severity: {
      type: String,
      default: ELogSeverity.INFO,
      enum: Object.values(ELogSeverity),
    },

    meta: { type: mongoose.Schema.Types.Mixed },

    url: String,
    createdBy: { _id: String, name: String, avatar: String } //As IUser
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


const LogModel =
  mongoose.models.logs || mongoose.model<ILog>("logs", logSchema);

export default LogModel;

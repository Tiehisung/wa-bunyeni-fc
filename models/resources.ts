import mongoose, { Schema } from "mongoose";

const resourceSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    description: { type: String, trim: true },
    files: [{ type: Schema.Types.ObjectId, ref: "files" }], //Ref to file model
  },
  { timestamps: true }
);

const ResourceModel =
  mongoose.models.resources || mongoose.model("resources", resourceSchema);

export default ResourceModel;

import connectDB from "@/config/db.config";
import mongoose, { Schema } from "mongoose";
connectDB();

const specialdataSchema = new Schema(
  {
    name: { type: String, required: true },
    data: {},
  },
  { timestamps: true }
);

const SpecialdataModel =
  mongoose.models.specialdatas ||
  mongoose.model("specialdatas", specialdataSchema);

export default SpecialdataModel;

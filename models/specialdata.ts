import { ConnectMongoDb } from "@/lib/dbconfig";
import mongoose, { Schema } from "mongoose";
ConnectMongoDb();

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

import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    email: { type: String, required: true },
    date: String,
    subject: String,
    text: String,
    html: String,
    read: { type: Schema.Types.Boolean, default: () => false },
    starred: { type: Schema.Types.Boolean, default: () => false },
    type: { type: String }, //sent | incoming | outbox | trashed | archived
  },
  { timestamps: true }
);

const MessageModel =
  mongoose.models.messages || mongoose.model("messages", messageSchema);

export default MessageModel;

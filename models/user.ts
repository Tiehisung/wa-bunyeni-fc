import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { EUserRole } from "@/types/user";
import { defaultPassword } from "@/data";

export const MiniUserSchema = new Schema(
  {
    name: { type: String },
    avatar: String,
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    role: { type: String, enum: Object.values(EUserRole) },
  },
  {
    timestamps: false,
  },
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    avatar: String,
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      defaulth: defaultPassword.hashed, // Hash the default password for new users - 1234
    },
    role: {
      type: String,
      enum: Object.values(EUserRole),
      default: EUserRole.FAN,
    },
    signupMode: {
      type: String,
      enum: ["google", "credentials"],
      default: "credentials",
    },
    emailVerified: { type: Boolean, default: true },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },

    fanProfile: { type: Schema.Types.ObjectId, ref: "users" },
  },
  {
    timestamps: true,
  },
);

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.models.users || mongoose.model("users", UserSchema);

export default UserModel;

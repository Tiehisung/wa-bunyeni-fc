import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { EUserRole } from "@/types/user";




const UserSchema = new Schema({
    name: { type: String, required: true },
    avatar: String,
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: Object.values(EUserRole), default: EUserRole.FAN },
    signupMode: { type: String, enum: ['google', 'credentials'], default: 'credentials' },
    emailVerified: { type: Boolean, default: true },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    refreshToken: {
        type: String,
        select: false
    },
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordExpires: {
        type: Date,
        select: false
    },

    // New fan fields
    fanPoints: { type: Number, default: 0 },
    fanBadges: [{ type: String }],
    fanRank: { type: Number },
    engagementScore: { type: Number, default: 0 },
    contributions: {
        comments: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        reactions: { type: Number, default: 0 },
        matchAttendance: { type: Number, default: 0 },
        galleries: { type: Number, default: 0 },
        newsViews: { type: Number, default: 0 }
    },
    fanSince: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },
    isFan: { type: Boolean, default: false }
}, {
    timestamps: true,
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;


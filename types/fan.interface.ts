import { IUser } from "./user";

// types/fan.interface.ts
export interface IFanContributions {
  comments: number;
  shares: number;
  reactions: number;
  matchAttendance: number;
  galleries: number;
  newsViews: number;
}

export interface IFanPreferences {
  notifications: boolean;
  favoritePlayer?: string;
  favoriteTeam?: string;
}

export interface IFan {
  _id: string;
  user: IUser;
  points: number;
  badges: EFanBadge[];
  rank?: number;
  engagementScore: number;
  contributions: IFanContributions;
  fanSince: string;
  lastActive: string;
  isActive: boolean;
  preferences: IFanPreferences;
  createdAt: string;
  updatedAt: string;
}

// types/fan.interface.ts
export enum EFanBadge {
  SUPER_FAN = "Super Fan",
  COMMENT_CHAMPION = "Comment Champion",
  MATCH_DAY_REGULAR = "Match Day Regular",
  SOCIAL_BUTTERFLY = "Social Butterfly",
  REACTION_MASTER = "Reaction Master",
  GALLERY_CONTRIBUTOR = "Gallery Contributor",
  EARLY_BIRD = "Early Bird",
  DEDICATED_FAN = "Dedicated Fan",
}

// Optional: Helper function to get badge icons
export const getFanBadgeIcon = (badge: EFanBadge): string => {
  const icons: Record<EFanBadge, string> = {
    [EFanBadge.SUPER_FAN]: "🏆",
    [EFanBadge.COMMENT_CHAMPION]: "💬",
    [EFanBadge.MATCH_DAY_REGULAR]: "⚽",
    [EFanBadge.SOCIAL_BUTTERFLY]: "🦋",
    [EFanBadge.REACTION_MASTER]: "❤️",
    [EFanBadge.GALLERY_CONTRIBUTOR]: "🖼️",
    [EFanBadge.EARLY_BIRD]: "🌅",
    [EFanBadge.DEDICATED_FAN]: "⭐",
  };
  return icons[badge];
};

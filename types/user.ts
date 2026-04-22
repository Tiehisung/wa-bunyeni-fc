export interface IUser {
  _id?: string
  avatar: string
  name: string;
  email: string;
  password?: string;
  role?: EUserRole;

  emailVerified?: boolean

  isActive?: boolean;
  lastLogin?: Date;
  resetPasswordExpires?: Date;
  isFan?: boolean;

  createdBy?: IMiniUser
  createdAt?: string;
  updatedAt?: string;
}

export interface IMiniUser {
  _id?: string
  avatar: string
  name: string;
  email: string;
  role?: EUserRole;
}

export enum EUserRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  PLAYER = 'player',
  FAN = 'fan',
}
export enum EUserAccount {
  CREDENTIALS = 'credentials',
  GOOGLE = 'google',
}

export interface IFan extends IUser {
  fanPoints: number;
  fanBadges: string[];
  fanRank?: number;
  engagementScore: number;
  contributions: {
    comments: number;
    shares: number;
    reactions: number;
    matchAttendance: number;
    galleries: number;
    newsViews: number;
  };
  fanSince: string;
  lastActive?: Date|string;
}

export interface ISession {
  user: {
    id: string
    name: string;
    avatar: string;
    role?: EUserRole
    email: string;
  };
  expires: string
}
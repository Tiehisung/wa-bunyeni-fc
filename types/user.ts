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
  avatar?: string
  name?: string;
  email?: string;
  role?: EUserRole;
}

export enum EUserRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  PLAYER = 'player',
  FAN = 'fan',
  COACH = "coach",
}
export enum EUserAccount {
  CREDENTIALS = 'credentials',
  GOOGLE = 'google',
}

 

export interface ISession {
  user: IMiniUser;
  expires: string
}
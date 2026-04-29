import { ENV } from "@/lib/env";
import { ITeam } from "@/types/match.interface";

export const TEAM: ITeam & { url: string, officialSignature: string } = {
    _id: ENV.TEAM_ID as string,
    url: ENV.APP_URL as string,
    name: ENV.TEAM_NAME as string,
    alias: ENV.TEAM_ALIAS as string,
    community: "Wa-Konjiehi" as string,
    logo: ENV.LOGO_NO_BG_URL as string,
    officialSignature: ENV.OFFICIAL_SIGNATURE_URL as string,
    currentPlayers: [],
    images: [
        'https://res.cloudinary.com/dcjeydowa/image/upload/v1776266149/assets-storage/d6zc3vfxa3udxbqgpqey.jpg',
        'https://res.cloudinary.com/dcjeydowa/image/upload/v1776266155/assets-storage/ldzq1j9vdupbi2pazj5j.jpg',
        'https://res.cloudinary.com/dcjeydowa/image/upload/v1776266165/assets-storage/jknt0akyyqklridm1ond.jpg',
        'https://res.cloudinary.com/dcjeydowa/image/upload/v1776266165/assets-storage/jknt0akyyqklridm1ond.jpg',
        'https://res.cloudinary.com/dcjeydowa/image/upload/v1776266322/assets-storage/m7fqq4vqq4sywdg2zu73.jpg',
        'https://res.cloudinary.com/dcjeydowa/image/upload/v1776266322/assets-storage/ym6tsmuddalimmzbyrhz.jpg',
    ],
    contact: ENV.CONTACT.PHONE as string,
    contactName: "Adam Wahid",
    createdAt: "2023-11-28T10:30:00Z",
    updatedAt: "2023-11-28T10:30:00Z",
};





// Type for the team data
export type Team = typeof TEAM;
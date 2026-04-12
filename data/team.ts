import { ENV } from "@/lib/env";
import { ITeam } from "@/types/match.interface";

export const TEAM: ITeam & { url: string, officialSignature: string } = {
    _id: ENV.TEAM_ID,// Example ObjectId
    url: ENV.APP_URL,
    name: ENV.TEAM_NAME,
    alias: ENV.TEAM_ALIAS,
    community: "Wa-Konjiehi",
    logo: ENV.LOGO_NO_BG_URL,
    officialSignature: ENV.OFFICIAL_SIGNATURE_URL,
    currentPlayers: [],
    contact: ENV.CONTACT.PHONE,
    contactName: "Adam Wahid",
    createdAt: "2023-11-28T10:30:00Z",
    updatedAt: "2023-11-28T10:30:00Z",
};





// Type for the team data
export type Team = typeof TEAM;
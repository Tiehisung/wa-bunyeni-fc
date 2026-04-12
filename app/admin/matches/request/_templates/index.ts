import { friendlyTemplates } from "./friendly"
import { competitionTemplates } from "./competition"
import { trainingTemplates } from "./training"
import { youthTemplates } from "./youth"
import { tournamentTemplates } from "./tournament"
import { replayTemplates } from "./replay"
import { IMatch } from "@/types/match.interface"
import { IStaff } from "@/types/staff.interface"


export interface ITemplate {
    id: string;
    title: string;
    tag?: ETemplateTag | string;
    body: string;
    isPopular?: boolean
}

export enum ETemplateTag {
    FRIENDLY = 'friendly',
    COMPETITION = 'competition',
    TRAINING = 'training',
    YOUTH = 'youth',
    TOURNAMENT = 'tournament',
    REPLAY = 'replay',
}

export function generateMatchRequestTemplates(
    match: IMatch, official: { requester: IStaff }
): ITemplate[] {
    return [
        ...friendlyTemplates(match, official),
        ...competitionTemplates(match, official),
        ...trainingTemplates(match, official),
        ...youthTemplates(match, official),
        ...tournamentTemplates(match, official),
        ...replayTemplates(match, official),
    ]
}

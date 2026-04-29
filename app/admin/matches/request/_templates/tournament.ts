import { TEAM } from "@/data/team";
import { checkTeams } from "@/lib/compute/match";
import { formatDate } from "@/lib/timeAndDate";
import { IMatch } from "@/types/match.interface";
import { IStaff } from "@/types/staff.interface";

export const tournamentTemplates = (match: IMatch, official: { requester: IStaff }) => {
    const { home, away } = checkTeams(match);
    const homeName = home?.name ?? "Home Team";
    const awayName = away?.name ?? "Away Team";
    const opponentName = match?.opponent?.name ?? "Opponent Club";
    const venue = match?.venue?.name
    const date = formatDate(match?.date);

    return [
        {
            id: "tournament_1",
            title: "Tournament Match Invitation",
            tag: "tournament",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We are pleased to invite <b>${awayName}</b> to participate in a tournament fixture against <b>${homeName}</b>.</p>

<ul>
<li><b>Fixture:</b> ${homeName} vs ${awayName}</li>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>We look forward to your confirmation.</p>

<p>Warm regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${official?.requester?.phone}<br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "tournament_2",
            title: "Official Tournament Fixture",
            tag: "tournament",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>This letter confirms a tournament match between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please confirm your availability.</p>

<p>Sincerely,<br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "tournament_3",
            title: "Tournament Match Scheduling",
            tag: "tournament",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We are scheduling a tournament fixture between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Kindly confirm to finalize the tournament schedule.</p>

<p>Best regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "tournament_4",
            title: "Tournament Participation Request",
            tag: "tournament",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We request your participation in an upcoming tournament match against <b>${homeName}</b>.</p>

<ul>
<li><b>Match Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>We look forward to your response.</p>

<p>Warm regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "tournament_5",
            title: "Tournament Match Confirmation",
            tag: "tournament",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>This is to confirm the tournament match between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please confirm that your club is available.</p>

<p>Sincerely,<br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "tournament_6",
            title: "Tournament Fixture Approval",
            tag: "tournament",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We seek your approval for the tournament fixture between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Your confirmation will allow us to finalize arrangements.</p>

<p>Kind regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "tournament_7",
            title: "Tournament Schedule Notice",
            tag: "tournament",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>This letter serves as notice for the tournament match between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>We kindly request your confirmation.</p>

<p>Best regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "tournament_8",
            title: "Tournament Match Agreement",
            tag: "tournament",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We are pleased to propose a tournament match between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please confirm your agreement.</p>

<p>Sincerely,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "tournament_9",
            title: "Tournament Fixture Notice",
            tag: "tournament",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>This is to notify you of a tournament fixture between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>We appreciate your confirmation.</p>

<p>Regards,<br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "tournament_10",
            title: "Final Tournament Confirmation",
            tag: "tournament",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We kindly request final confirmation for the tournament match between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Thank you for your cooperation.</p>

<p>Yours faithfully,<br/>
<b>${official?.requester?.fullname}</b><br/>
${official?.requester?.phone}<br/>
${TEAM.name}</p>
            `.trim(),
        },
    ];
};

import { TEAM } from "@/data/team";
import { checkTeams } from "@/lib/compute/match";
import { formatDate } from "@/lib/timeAndDate";
import { IMatch } from "@/types/match.interface";
import { IStaff } from "@/types/staff.interface";

export const trainingTemplates = (match: IMatch, official: { requester: IStaff }) => {
    const { home, away } = checkTeams(match);
    const homeName = home?.name ?? "Home Team";
    const awayName = away?.name ?? "Away Team";
    const opponentName = match?.opponent?.name ?? "Opponent Club";
    const venue = match?.venue?.name
    const date = formatDate(match?.date);

    return [
        {
            id: "training_1",
            title: "Training Match Request",
            tag: "training",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We would like to arrange a training match between <b>${homeName}</b> and <b>${awayName}</b> as part of our preparation schedule.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please let us know if your team is available.</p>

<p>Kind regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "training_2",
            title: "Practice Session Match",
            tag: "training",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>As part of our practice sessions, <b>${homeName}</b> requests a friendly training match with <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Looking forward to your confirmation.</p>

<p>Best regards,<br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "training_3",
            title: "Pre-Match Training Request",
            tag: "training",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We are planning a pre-match training fixture between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please confirm your availability.</p>

<p>Sincerely,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "training_4",
            title: "Team Development Training Match",
            tag: "training",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>To support team development, we request a training match between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>We appreciate your reply.</p>

<p>Kind regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "training_5",
            title: "Friendly Training Match Invitation",
            tag: "training",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We would like to invite <b>${awayName}</b> to a friendly training match with <b>${homeName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please let us know if this works.</p>

<p>Warm regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "training_6",
            title: "Technical Training Match",
            tag: "training",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p><b>${homeName}</b> is seeking a technical training match against <b>${awayName}</b> to practice tactical formations and player coordination.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Kindly confirm.</p>

<p>Sincerely,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "training_7",
            title: "Youth Training Match",
            tag: "training",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>As part of our youth development program, we request a training match between the squads of <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Looking forward to your confirmation.</p>

<p>Best regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "training_8",
            title: "Mid-Season Training Fixture",
            tag: "training",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We propose a mid-season training fixture between <b>${homeName}</b> and <b>${awayName}</b> to maintain match fitness and team cohesion.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please let us know if you are available.</p>

<p>Kind regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "training_9",
            title: "Tactical Training Match",
            tag: "training",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We would like to organize a tactical training match between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Your confirmation would be appreciated.</p>

<p>Sincerely,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "training_10",
            title: "End-of-Week Training Match",
            tag: "training",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>At the end of our training week, we would like to arrange a friendly match between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please confirm your team’s availability.</p>

<p>Best regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },
    ];
};

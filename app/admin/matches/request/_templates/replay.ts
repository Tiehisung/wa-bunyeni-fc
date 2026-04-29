import { TEAM } from "@/data/team";
import { checkTeams } from "@/lib/compute/match";
import { formatDate } from "@/lib/timeAndDate";
import { IMatch } from "@/types/match.interface";
import { IStaff } from "@/types/staff.interface";

export const replayTemplates = (match: IMatch, official: { requester: IStaff }) => {
    const { home, away } = checkTeams(match);
    const homeName = home?.name ?? "Home Team";
    const awayName = away?.name ?? "Away Team";
    const opponentName = match?.opponent?.name ?? "Opponent Club";
    const venue = match?.venue?.name
    const date = formatDate(match?.date);

    return [
        {
            id: "replay_1",
            title: "Match Replay Request",
            tag: "replay",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>Due to circumstances affecting our previous fixture, we kindly request a replay of the match between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Proposed Replay Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>We appreciate your cooperation.</p>

<p>Sincerely,<br/>
<b>${official?.requester?.fullname}</b><br/>
${official?.requester?.phone}<br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "replay_2",
            title: "Official Replay Scheduling",
            tag: "replay",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>This letter serves as a formal request to schedule a replay of <b>${homeName}</b> vs <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please confirm your availability.</p>

<p>Best regards,<br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "replay_3",
            title: "Replay Fixture Confirmation",
            tag: "replay",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We are writing to confirm the replay of the fixture between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Kindly acknowledge receipt.</p>

<p>Sincerely,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "replay_4",
            title: "Replay Match Notice",
            tag: "replay",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>This is an official notice regarding the replay of the match between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>We appreciate your cooperation.</p>

<p>Kind regards,<br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "replay_5",
            title: "Replay Fixture Agreement",
            tag: "replay",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We kindly request your agreement to the replay of <b>${homeName}</b> vs <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please confirm your acceptance.</p>

<p>Warm regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "replay_6",
            title: "Rescheduled Match Replay",
            tag: "replay",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>Following the rescheduling of our previous fixture, we propose a replay between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Proposed Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please let us know if this is suitable.</p>

<p>Sincerely,<br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "replay_7",
            title: "Replay Match Confirmation",
            tag: "replay",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We kindly request final confirmation for the replay of <b>${homeName}</b> vs <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Thank you for your cooperation.</p>

<p>Yours faithfully,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "replay_8",
            title: "Replay Fixture Notice",
            tag: "replay",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>This letter serves as notice for the replay of <b>${homeName}</b> vs <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>We appreciate your prompt confirmation.</p>

<p>Best regards,<br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "replay_9",
            title: "Official Replay Communication",
            tag: "replay",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We are communicating the replay arrangement for the fixture between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Replay Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please acknowledge receipt.</p>

<p>Regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "replay_10",
            title: "Final Replay Notice",
            tag: "replay",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>This is the final notice for the replay of <b>${homeName}</b> vs <b>${awayName}</b>.</p>

<ul>
<li><b>Replay Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please acknowledge receipt.</p>

<p>Regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },
    ];
}

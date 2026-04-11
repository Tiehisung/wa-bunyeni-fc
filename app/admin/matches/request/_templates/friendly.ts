import { TEAM } from "@/data/team";
import { checkTeams } from "@/lib/compute/match";
import { formatDate } from "@/lib/timeAndDate";

import { IMatch } from "@/types/match.interface";
import { IStaff } from "@/types/staff.interface";


export const friendlyTemplates = (match: IMatch, official: { requester: IStaff }) => {
    const { home, away } = checkTeams(match);
    const homeName = home?.name ?? "Home Team";
    const awayName = away?.name ?? "Away Team";
    const opponentName = match?.opponent?.name ?? "Opponent Club";
    const venue = match?.venue?.name
    const date = formatDate(match?.date);

    return [
        {
            id: "friendly_1",
            isPopular: true,
            title: "Standard Friendly Request",
            tag: "friendly",
            body: `
            <p>Dear <b>${opponentName}</b>,</p>
            <p>We would like to request a friendly match between <b>${homeName}</b> and <b>${awayName}</b>.</p>
            <ul>
            <li><b>Fixture:</b> ${homeName} vs ${awayName}</li>
            <li><b>Date:</b> ${date}</li>
            <li><b>Venue:</b> ${venue}</li>
            </ul>
            <p>We believe this fixture would be beneficial for both teams in terms of preparation and development.</p>
            <p>Kind regards,<br/>
            <b>${official?.requester?.fullname}</b><br/>
            ${official?.requester?.phone}<br/>
            ${TEAM.name}</p>
                        `.trim(),
        },

        {
            id: "friendly_2",
            title: "Pre-Season Friendly",
            tag: "friendly",
            body: `
            <p>Dear <b>${opponentName}</b>,</p>

            <p>As part of our pre-season preparations, <b>${homeName}</b> would like to arrange a friendly match against <b>${awayName}</b>.</p>

            <ul>
            <li><b>Fixture:</b> ${homeName} vs ${awayName}</li>
            <li><b>Preferred Date:</b> ${date}</li>
            <li><b>Venue:</b> ${venue}</li>
            </ul>

            <p>Please let us know if your team is available.</p>

            <p>Best regards,<br/>
            ${TEAM.name}</p>
                        `.trim(),
        },

        {
            id: "friendly_3",
            title: "Mid-Season Friendly",
            tag: "friendly",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We are interested in scheduling a mid-season friendly between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Fixture:</b> ${homeName} vs ${awayName}</li>
<li><b>Date:</b> ${date}</li>
</ul>

<p>This would be a valuable opportunity for squad rotation and tactical testing.</p>

<p>Sincerely,<br/>
<b>${official?.requester?.fullname}</b><br/>
${official?.requester?.phone}<br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "friendly_4",
            title: "Home Friendly Invitation",
            tag: "friendly",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We would like to invite <b>${awayName}</b> to play a friendly match against <b>${homeName}</b> at our home ground.</p>

<ul>
<li><b>Fixture:</b> ${homeName} vs ${awayName}</li>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>We look forward to your response.</p>

<p>Warm regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${official?.requester?.phone}<br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "friendly_5",
            title: "Away Friendly Request",
            tag: "friendly",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p><b>${homeName}</b> would like to request an away friendly match against <b>${awayName}</b> at your venue.</p>

<ul>
<li><b>Proposed Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please let us know if you are able to host this fixture.</p>

<p>Best wishes,<br/>
<b>${official?.requester?.fullname}</b><br/>
${official?.requester?.phone}<br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "friendly_6",
            title: "Development Friendly",
            tag: "friendly",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We would like to organize a development-focused friendly match between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>This will support player development and squad depth.</p>

<p>Kind regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${official?.requester?.phone}<br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "friendly_7",
            title: "Training Friendly",
            tag: "friendly",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>As part of our training schedule, <b>${homeName}</b> would like to play a friendly match against <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please advise if your team is available.</p>

<p>Best regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${official?.requester?.phone}<br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "friendly_8",
            title: "Friendly Match Confirmation Request",
            tag: "friendly",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We would like to confirm your availability for a friendly match between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>We appreciate your reply at your earliest convenience.</p>

<p>Sincerely,<br/>
<b>${official?.requester?.fullname}</b><br/>
${official?.requester?.phone}<br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "friendly_9",
            title: "Community Friendly",
            tag: "friendly",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We would love to arrange a friendly match between <b>${homeName}</b> and <b>${awayName}</b> as a community-focused fixture.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>This will be a great opportunity to engage supporters and promote local football.</p>

<p>Warm regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${official?.requester?.phone}<br/>
${TEAM.name}</p>
            `.trim(),
        },

        {
            id: "friendly_10",
            title: "Friendly Match Proposal",
            tag: "friendly",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>On behalf of <b>${homeName}</b>, we propose a friendly match against <b>${awayName}</b>.</p>

<ul>
<li><b>Proposed Date:</b> ${date}</li>
<li><b>Preferred Venue:</b> ${venue}</li>
</ul>

<p>Please let us know if this works for your club.</p>

<p>Yours sincerely,<br/>
<b>${official?.requester?.fullname}</b><br/>
${official?.requester?.phone}<br/>
${TEAM.name}</p>
            `.trim(),
        },
    ];
}

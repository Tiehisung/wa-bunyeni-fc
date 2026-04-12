import { TEAM } from "@/data/team";
import { checkTeams } from "@/lib/compute/match";
import { formatDate } from "@/lib/timeAndDate";
import { IMatch } from "@/types/match.interface";
import { IStaff } from "@/types/staff.interface";

export const youthTemplates = (match: IMatch, official: { requester: IStaff }) => {
    const { home, away } = checkTeams(match);
    const homeName = home?.name ?? "Home Team";
    const awayName = away?.name ?? "Away Team";
    const opponentName = match?.opponent?.name ?? "Opponent Club";
    const venue = match?.venue?.name
    const date = formatDate(match?.date);

    return [
        {
            id: "youth_1",
            title: "Youth Friendly Request",
            tag: "youth",
            body: `
                <p>Dear <b>${opponentName}</b>,</p>
                <p>We would like to arrange a youth match between <b>${homeName}</b> and <b>${awayName}</b> as part of our academy development program.</p>
                <ul>
                <li><b>Date:</b> ${date}</li>
                <li><b>Venue:</b> ${venue}</li>
                </ul>
                <p>We look forward to your confirmation.</p>
                <p>Kind regards,<br/>
                <b>${official?.requester?.fullname}</b><br/>
                ${TEAM.name}</p>
                            `.trim(),
        },
        {
            id: "youth_2",
            title: "Academy Match Proposal",
            tag: "youth",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>Our academy team at <b>${homeName}</b> would like to play against <b>${awayName}</b> in a youth development match.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please let us know if your youth squad is available.</p>

<p>Warm regards,<br/>
${TEAM.name}</p>
            `.trim(),
        },
        {
            id: "youth_3",
            title: "Youth Development Fixture",
            tag: "youth",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We are scheduling a youth development fixture between <b>${homeName}</b> and <b>${awayName}</b>. This match will support player growth and competitive exposure.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Best wishes,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },
        {
            id: "youth_4",
            title: "Under-Age Match Invitation",
            tag: "youth",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We invite your under-age team to participate in a youth match against <b>${homeName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>We look forward to your response.</p>

<p>Sincerely,<br/>
${TEAM.name}</p>
            `.trim(),
        },
        {
            id: "youth_5",
            title: "Youth Match Confirmation",
            tag: "youth",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>This letter is to confirm a youth match between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please confirm your availability.</p>

<p>Kind regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },
        {
            id: "youth_6",
            title: "Academy Fixture Scheduling",
            tag: "youth",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We would like to schedule an academy fixture between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please confirm if your youth team is available.</p>

<p>Best regards,<br/>
${TEAM.name}</p>
            `.trim(),
        },
        {
            id: "youth_7",
            title: "Youth Squad Match",
            tag: "youth",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>Our youth squad would be pleased to play against <b>${awayName}</b> in a friendly development match.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>We hope to hear from you soon.</p>

<p>Warm regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },
        {
            id: "youth_8",
            title: "Youth League Fixture",
            tag: "youth",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We are organizing a youth league match between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Kindly confirm your availability.</p>

<p>Sincerely,<br/>
${TEAM.name}</p>
            `.trim(),
        },
        {
            id: "youth_9",
            title: "Academy Match Notice",
            tag: "youth",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>This is a notice for the upcoming academy match between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>We look forward to your confirmation.</p>

<p>Regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
            `.trim(),
        },
        {
            id: "youth_10",
            title: "Final Youth Fixture Confirmation",
            tag: "youth",
            body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We kindly request final confirmation for the youth fixture between <b>${homeName}</b> and <b>${awayName}</b>.</p>

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
    ];
};

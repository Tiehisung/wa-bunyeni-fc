
import { TEAM } from "@/data/team";
import { checkTeams } from "@/lib/compute/match";
import { formatDate } from "@/lib/timeAndDate";

import { IMatch } from "@/types/match.interface";
import { IStaff } from "@/types/staff.interface";

export const competitionTemplates = (
  match: IMatch,
  official: { requester: IStaff }
) => {
  const { home, away } = checkTeams(match);

  const homeName = home?.name ?? "Home Team";
  const awayName = away?.name ?? "Away Team";
  const opponentName = match?.opponent?.name ?? "Opponent Club";
  const venue = match?.venue?.name
  const date = formatDate(match?.date);

  return [
    {
      id: "competition_1",
      title: "League Match Confirmation",
      tag: "competition",
      body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>This letter serves as official confirmation of the competitive fixture between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Fixture:</b> ${homeName} vs ${awayName}</li>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please confirm that your club is available to proceed as scheduled.</p>

<p>Sincerely,<br/>
<b>${official?.requester?.fullname}</b><br/>
${official?.requester?.phone}<br/>
${TEAM.name}</p>
      `.trim(),
    },

    {
      id: "competition_2",
      title: "Official League Fixture Request",
      tag: "competition",
      body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We are writing on behalf of <b>${homeName}</b> to formally request confirmation of our league match against <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>We look forward to your confirmation so that we can finalize all arrangements professionally.</p>

<p>Best regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
      `.trim(),
    },

    {
      id: "competition_3",
      title: "Competition Match Scheduling",
      tag: "competition",
      body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>This is to schedule our competition fixture between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Fixture:</b> ${homeName} vs ${awayName}</li>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please confirm your acceptance of these arrangements at your earliest convenience.</p>

<p>Yours sincerely,<br/>
<b>${official?.requester?.fullname}</b><br/>
${official?.requester?.phone}</p>
      `.trim(),
    },

    {
      id: "competition_4",
      title: "Match Day Confirmation",
      tag: "competition",
      body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We kindly request your confirmation for the upcoming competitive match between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>We appreciate your prompt response to ensure smooth match operations.</p>

<p>Kind regards,<br/>
${TEAM.name}</p>
      `.trim(),
    },

    {
      id: "competition_5",
      title: "Official Match Notice",
      tag: "competition",
      body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>This is an official notice regarding the scheduled competitive fixture between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please confirm that your team will be available to proceed.</p>

<p>Sincerely,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
      `.trim(),
    },

    {
      id: "competition_6",
      title: "Competition Fixture Verification",
      tag: "competition",
      body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We are verifying the details for the upcoming competitive fixture between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Kindly confirm that these arrangements are acceptable.</p>

<p>Best regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
      `.trim(),
    },

    {
      id: "competition_7",
      title: "League Match Scheduling",
      tag: "competition",
      body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>This letter is to formally schedule our league match between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Please confirm your availability at your earliest convenience.</p>

<p>Sincerely,<br/>
<b>${official?.requester?.fullname}</b><br/>
${official?.requester?.phone}</p>
      `.trim(),
    },

    {
      id: "competition_8",
      title: "Competitive Fixture Approval",
      tag: "competition",
      body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We seek your approval for the competitive fixture between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Match Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Your confirmation will allow us to finalize match operations professionally.</p>

<p>Warm regards,<br/>
${TEAM.name}</p>
      `.trim(),
    },

    {
      id: "competition_9",
      title: "Official Fixture Notification",
      tag: "competition",
      body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>This is to notify you of the scheduled competition match between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>Kindly confirm receipt and acceptance to ensure proper coordination.</p>

<p>Regards,<br/>
<b>${official?.requester?.fullname}</b><br/>
${TEAM.name}</p>
      `.trim(),
    },

    {
      id: "competition_10",
      title: "Final Match Confirmation",
      tag: "competition",
      body: `
<p>Dear <b>${opponentName}</b>,</p>

<p>We kindly request final confirmation for the competitive fixture between <b>${homeName}</b> and <b>${awayName}</b>.</p>

<ul>
<li><b>Date:</b> ${date}</li>
<li><b>Venue:</b> ${venue}</li>
</ul>

<p>We appreciate your cooperation and look forward to a smooth match.</p>

<p>Yours faithfully,<br/>
<b>${official?.requester?.fullname}</b><br/>
${official?.requester?.phone}<br/>
${TEAM.name}</p>
      `.trim(),
    },
  ];
};

'use client'

 
import { IStaff } from "@/types/staff.interface";
import { checkTeams } from "@/lib/compute/match";
import { IMatch } from "@/types/match.interface";
import { TEAM } from "@/data/team";

export const printMatchRequestLetter = (
  template: { title: string; body: string },
  match: IMatch,
  official: { requester: IStaff },
) => {
  const printWindow = window.open("", "_blank");
  const { home, away } = checkTeams(match);
  if (!printWindow) return;

  const today = new Date().toLocaleDateString();

  printWindow.document.write(`
  <html>
    <head>
      <title>${template.title}</title>

      <style>
        body {
          font-family: "Times New Roman", serif;
          padding: 40px;
          color: #000;
          background: white;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid #000;
          padding-bottom: 12px;
          margin-bottom: 20px;
        }

        .logo {
          height: 70px;
        }

        .center {
          text-align: center;
        }

        .center h1 {
          margin: 0;
          font-size: 26px;
          letter-spacing: 1px;
        }

        .center p {
          margin: 4px 0;
          font-size: 13px;
        }

        .meta {
          margin-top: 16px;
          font-size: 14px;
        }

        .meta span {
          display: block;
          margin-bottom: 4px;
        }

        .content {
          margin-top: 30px;
          font-size: 15px;
          white-space: pre-wrap;
          line-height: 1.7;
        }

        .footer {
          margin-top: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .signature img {
          height: 60px;
        }

        .sign-text {
          margin-top: 4px;
          font-size: 13px;
        }

        @media print {
          body {
            padding: 20px;
          }
        }
      </style>
    </head>

    <body>
      <!-- HEADER -->
      <div class="header">
        <img src="${TEAM.logo}" class="logo" />
        <div class="center">
          <h1>${TEAM.name}</h1>
          <p>Official Match Correspondence</p>
        </div>
        <img src="${TEAM.logo}" class="logo" />
      </div>

      <!-- META -->
      <div class="meta">
        <span><strong>Date:</strong> ${today}</span>
        <span><strong>Fixture:</strong> ${home?.name} vs ${away?.name}</span>
      </div>

      <!-- LETTER BODY -->
      <div class="content">
        ${template.body.replace(/\n/g, "<br/>")}
      </div>

      <!-- SIGNATURE -->
      <div class="footer">
        <div>
          <strong>${official?.requester?.fullname}</strong><br/>
          ${official?.requester?.role || ""}<br/>
          ${official?.requester?.phone || ""}
        </div>

        <div class="signature">
          <img src="${TEAM.officialSignature}" />
          <div class="sign-text">
            For ${TEAM.name}
          </div>
        </div>
      </div>

      <script>
        window.onload = () => window.print()
      </script>

    </body>
  </html>
  `);

  printWindow.document.close();
};

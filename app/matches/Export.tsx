"use client";

import { Button } from "@/components/buttons/Button";
import { Printer } from "lucide-react";
import { formatDate, formatTimeToAmPm } from "@/lib/timeAndDate";
import { IMatch, EMatchStatus, EMatchCategory } from "@/types/match.interface";
import { checkMatchMetrics, checkTeams } from "@/lib/compute/match";
import { useGetMatchesQuery } from "@/services/match.endpoints";

export const printMatchesList = (
  matches: IMatch[],
  options: { title?: string; showDetails?: boolean } = {
    title: "Matches List",
    showDetails: true,
  },
) => {
  const printWindow = window.open("", "_blank");

  if (!printWindow) return;

  const rows = matches
    .map((match, index) => {
      const { home, away } = checkTeams(match);
      const metrics = checkMatchMetrics(match);
      const isUpcoming = match.status === EMatchStatus.UPCOMING;
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${match.title || `${home?.name} vs ${away?.name}`}</td>
          <td>${match.category || "Senior"}</td>
          <td>${match.competition || "Friendly"}</td>
          <td>${formatDate(match.date, "dd/mm/yyyy")}</td>
          <td>${match.time ? formatTimeToAmPm(match.time) : "TBD"}</td>
          <td>${match.venue?.name || "TBD"}</td>
          <td>
            <span class="badge ${getStatusBadgeClass(match.status)}">
              ${match.status}
            </span>
          </td>
          ${
            !isUpcoming
              ? `
            <td class="text-center font-bold">${metrics?.scoreline}</td>
            <td class="text-center">${metrics?.winStatus?.toUpperCase()}</td>
          `
              : `<td></td>
                <td></td>`
          }
          <td>${match.opponent?.name || "N/A"}</td>
          <td>${match.isHome ? "Home 🏠" : "Away ✈️"}</td>
        </tr>
      `;
    })
    .join("");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${options?.title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            padding: 24px;
            background: #fff;
            color: #1a1a1a;
          }

          .header {
            text-align: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 2px solid #ddd;
          }

          h1 {
            font-size: 24px;
            margin-bottom: 8px;
            color: #1e3a5f;
          }

          .club-name {
            font-size: 14px;
            color: #666;
            letter-spacing: 2px;
          }

          .meta {
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
            font-size: 13px;
            background: #f5f5f5;
            padding: 12px;
            border-radius: 8px;
          }

          .meta-item {
            display: flex;
            gap: 8px;
          }

          .meta-label {
            font-weight: 600;
            color: #555;
          }

          .meta-value {
            color: #1a1a1a;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
            font-size: 13px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }

          th {
            background: #1e3a5f;
            color: white;
            padding: 10px 8px;
            font-weight: 600;
            text-align: left;
            font-size: 12px;
          }

          td {
            padding: 8px;
            border-bottom: 1px solid #e0e0e0;
            vertical-align: top;
          }

          tr:hover {
            background: #fafafa;
          }

          .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
          }

          .badge-upcoming { background: #fef3c7; color: #92400e; }
          .badge-live { background: #fee2e2; color: #dc2626; animation: pulse 1.5s infinite; }
          .badge-ft { background: #dcfce7; color: #166534; }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }

          .score {
            font-weight: bold;
            font-size: 14px;
          }

          .result-win { color: #16a34a; }
          .result-loss { color: #dc2626; }
          .result-draw { color: #eab308; }

          .footer {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #ddd;
            font-size: 11px;
            text-align: center;
            color: #999;
          }

          @media print {
            body {
              padding: 12px;
            }
            .badge-live {
              background: #fee2e2;
              color: #dc2626;
              animation: none;
            }
            th {
              background: #1e3a5f;
              color: white;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>

      <body>
        <div class="header">
          <h1>${options?.title}</h1>
          <div class="club-name">Bunyeni FC • ${new Date().getFullYear()} Season</div>
        </div>

        <div class="meta">
          <div class="meta-item">
            <span class="meta-label">Generated:</span>
            <span class="meta-value">${new Date().toLocaleString()}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Total Matches:</span>
            <span class="meta-value">${matches?.length || 0}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Upcoming:</span>
            <span class="meta-value">${matches?.filter((m) => m.status === EMatchStatus.UPCOMING).length || 0}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Played:</span>
            <span class="meta-value">${matches?.filter((m) => m.status === EMatchStatus.FT).length || 0}</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Match</th>
              <th>Category</th>
              <th>Competition</th>
              <th>Date</th>
              <th>Time</th>
              <th>Venue</th>
              <th>Status</th>
              ${
                matches?.some((m) => m.status !== EMatchStatus.UPCOMING)
                  ? `
              <th>Score</th>
              <th>Result</th>
              `
                  : ""
              }
              <th>Opponent</th>
              <th>H/A</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="12" style="text-align:center">No matches found</td></tr>'}
          </tbody>
        </table>

        <div class="footer">
          This is an official document of Bunyeni FC • ${new Date().getFullYear()}
        </div>

        <script>
          window.onload = () => {
            setTimeout(() => window.print(), 500);
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};

const getStatusBadgeClass = (status: EMatchStatus): string => {
  switch (status) {
    case EMatchStatus.UPCOMING:
      return "badge-upcoming";
    case EMatchStatus.LIVE:
      return "badge-live";
    case EMatchStatus.FT:
      return "badge-ft";
    default:
      return "";
  }
};

// Single Match Print (for detailed match report)
export const printMatchDetails = (
  match: IMatch,
  options?: { title?: string },
) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const { home, away } = checkTeams(match);
  const metrics = checkMatchMetrics(match);
  const isFinished = match.status === EMatchStatus.FT;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${options?.title || match.title || "Match Report"}</title>
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            padding: 32px;
            max-width: 800px;
            margin: 0 auto;
          }
          h1 { color: #1e3a5f; border-bottom: 2px solid #ddd; padding-bottom: 12px; }
          .match-header { text-align: center; margin: 24px 0; }
          .teams { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
          .team { text-align: center; flex: 1; }
          .team-name { font-size: 20px; font-weight: bold; margin-top: 8px; }
          .score { font-size: 32px; font-weight: bold; padding: 0 24px; }
          .match-info { background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e0e0e0; }
          .stats-section { margin-top: 24px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f0f0f0; }
        </style>
      </head>
      <body>
        <h1>${options?.title || "Match Report"}</h1>
        
        <div class="match-header">
          <div class="teams">
            <div class="team">
              <div class="team-name">${home?.name}</div>
            </div>
            <div class="score">${metrics?.scoreline || "VS"}</div>
            <div class="team">
              <div class="team-name">${away?.name}</div>
            </div>
          </div>
        </div>

        <div class="match-info">
          <div class="info-row"><strong>Competition:</strong> ${match.competition || "Friendly"}</div>
          <div class="info-row"><strong>Category:</strong> ${match.category?.toUpperCase()}</div>
          <div class="info-row"><strong>Date:</strong> ${formatDate(match.date)}</div>
          <div class="info-row"><strong>Time:</strong> ${match.time ? formatTimeToAmPm(match.time) : "TBD"}</div>
          <div class="info-row"><strong>Venue:</strong> ${match.venue?.name || "TBD"}</div>
          <div class="info-row"><strong>Status:</strong> ${match.status}</div>
        </div>

        ${
          isFinished && metrics
            ? `
          <div class="stats-section">
            <h3>Match Statistics</h3>
            <table>
              <tr><th>Statistic</th><th>${home?.name}</th><th>${away?.name}</th></tr>
              <tr><td>Goals</td><td>${metrics.goals?.home || 0}</td><td>${metrics.goals?.away || 0}</td></tr>
              <tr><td>Shots</td><td>-</td><td>-</td></tr>
              <tr><td>Possession</td><td>-</td><td>-</td></tr>
            </table>
          </div>
        `
            : ""
        }

        <div style="margin-top: 32px; font-size: 11px; text-align: center; color: #999;">
          Generated on ${new Date().toLocaleString()} • Bunyeni FC
        </div>

        <script>
          window.onload = () => setTimeout(() => window.print(), 500);
        </script>
      </body>
    </html>
  `);
};

// React Component
interface PrintMatchesBtnProps {
  matches?: IMatch[];
  options?: { title?: string; showDetails?: boolean };
}

export function PrintMatchesBtn({ matches, options }: PrintMatchesBtnProps) {
  const { data, isLoading } = useGetMatchesQuery(
    { limit: 200 },
    {
      skip: !!matches?.length,
    },
  );

  const matchesToPrint = matches || data?.data || [];

  return (
    <Button
      onClick={() => printMatchesList(matchesToPrint, options)}
      variant="secondary"
      waiting={isLoading}
      disabled={!matchesToPrint.length}
    >
      <Printer className="h-4 w-4 mr-2" />
      Print List
    </Button>
  );
}

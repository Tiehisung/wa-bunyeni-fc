"use client";

import { Button } from "@/components/buttons/Button";
import { Printer } from "lucide-react";
import { formatDate } from "@/lib/timeAndDate";
import { IPlayer, EPlayerStatus } from "@/types/player.interface";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import { ENV } from "@/lib/env";

/**
 * Get status badge CSS class
 */
const getStatusBadgeClass = (status: EPlayerStatus): string => {
  switch (status) {
    case EPlayerStatus.CURRENT:
      return "badge-active";
    case EPlayerStatus.FORMER:
      return "badge-inactive";
    default:
      return "";
  }
};

/**
 * Print players list
 */
export const printPlayersList = (
  players: IPlayer[],
  options: { title?: string; showDetails?: boolean } = {
    title: "Players List",
    showDetails: true,
  },
) => {
  const printWindow = window.open("", "_blank");

  if (!printWindow) return;

  const rows = players
    .map((player, index) => {
      const fullName = `${player.firstName} ${player.lastName}`;
      const age = player.dob
        ? new Date().getFullYear() - new Date(player.dob).getFullYear()
        : "N/A";

      return `
        <tr>
          <td class="text-center">${index + 1}</td>
          <td>${player.code || "N/A"}</td>
          <td>${fullName}</td>
          <td class="text-center">${player.number || "N/A"}</td>
          <td>${player.position || "N/A"}</td>
          <td>${player.status || EPlayerStatus.CURRENT}</td>
          <td class="text-center">${age}</td>
          <td>${player.height ? `${player.height} ft` : "N/A"}</td>
          <td>${player.phone || "N/A"}</td>
          <td>${player.email || "N/A"}</td>
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
            font-size: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }

          th {
            background: #1e3a5f;
            color: white;
            padding: 10px 8px;
            font-weight: 600;
            text-align: left;
            font-size: 11px;
          }

          td {
            padding: 8px;
            border-bottom: 1px solid #e0e0e0;
            vertical-align: middle;
          }

          tr:hover {
            background: #fafafa;
          }

          .text-center {
            text-align: center;
          }

          .badge-active {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
            background: #dcfce7;
            color: #166534;
          }

          .badge-inactive {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
            background: #fee2e2;
            color: #dc2626;
          }

          .badge-loan {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
            background: #fef3c7;
            color: #92400e;
          }

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
            th {
              background: #1e3a5f;
              color: white;
              print-color-adjust: exact;
            }
            .badge-active, .badge-inactive, .badge-loan {
              print-color-adjust: exact;
            }
          }
        </style>
      </head>

      <body>
        <div class="header">
          <h1>${options?.title}</h1>
          <div class="club-name">${ENV.TEAM_NAME} • ${new Date().getFullYear()} Season</div>
        </div>

        <div class="meta">
          <div class="meta-item">
            <span class="meta-label">Generated:</span>
            <span class="meta-value">${new Date().toLocaleString()}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Total Players:</span>
            <span class="meta-value">${players?.length || 0}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Active:</span>
            <span class="meta-value">${players?.filter((p) => p.status === EPlayerStatus.CURRENT).length || 0}</span>
          </div>
          
        </div>

        <table>
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th>Code</th>
              <th>Name</th>
              <th class="text-center">No.</th>
              <th>Position</th>
              <th>Status</th>
              <th class="text-center">Age</th>
              <th>Height</th>
              <th>Phone</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="10" style="text-align:center">No players found</td></tr>'}
          </tbody>
        </table>

        <div class="footer">
          This is an official document of ${ENV.TEAM_NAME} • ${new Date().getFullYear()}
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

/**
 * Print single player details
 */
export const printPlayerDetails = (
  player: IPlayer,
  options?: { title?: string },
) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const fullName = `${player.firstName} ${player.lastName}`;
  const age = player.dob
    ? new Date().getFullYear() - new Date(player.dob).getFullYear()
    : "N/A";

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${options?.title || `${fullName} - Player Profile`}</title>
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            padding: 32px;
            max-width: 800px;
            margin: 0 auto;
          }
          h1 { 
            color: #1e3a5f; 
            border-bottom: 2px solid #ddd; 
            padding-bottom: 12px; 
          }
          .player-header {
            display: flex;
            gap: 24px;
            margin: 24px 0;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 12px;
          }
          .player-avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            background: #e0e0e0;
          }
          .player-info {
            flex: 1;
          }
          .player-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .player-code {
            color: #666;
            margin-bottom: 12px;
            font-family: monospace;
          }
          .details-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin: 20px 0;
          }
          .detail-item {
            padding: 8px 0;
            border-bottom: 1px solid #e0e0e0;
          }
          .detail-label {
            font-weight: 600;
            color: #555;
            margin-right: 12px;
          }
          .section {
            margin-top: 24px;
          }
          .section-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #1e3a5f;
          }
          .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }
          .badge-active { background: #dcfce7; color: #166534; }
          .badge-inactive { background: #fee2e2; color: #dc2626; }
          .footer {
            margin-top: 32px;
            text-align: center;
            font-size: 11px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 16px;
          }
        </style>
      </head>
      <body>
        <h1>${options?.title || "Player Profile"}</h1>
        
        <div class="player-header">
          <div class="player-avatar" style="background: #e0e0e0; display: flex; align-items: center; justify-content: center; font-size: 48px;">
            ${player.avatar ? `<img src="${player.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" />` : "👤"}
          </div>
          <div class="player-info">
            <div class="player-name">${fullName}</div>
            <div class="player-code">Code: ${player.code || "N/A"} | #${player.number || "N/A"}</div>
            <div>
              <span class="badge ${player.status === EPlayerStatus.CURRENT ? "badge-active" : "badge-inactive"}">
                ${player.status || "CURRENT"}
              </span>
            </div>
          </div>
        </div>

        <div class="details-grid">
          <div class="detail-item"><span class="detail-label">Position:</span> ${player.position || "N/A"}</div>
          <div class="detail-item"><span class="detail-label">Jersey Number:</span> ${player.number || "N/A"}</div>
          <div class="detail-item"><span class="detail-label">Age:</span> ${age}</div>
          <div class="detail-item"><span class="detail-label">Height:</span> ${player.height ? `${player.height} ft` : "N/A"}</div>
          <div class="detail-item"><span class="detail-label">Date of Birth:</span> ${player.dob ? formatDate(player.dob) : "N/A"}</div>
          <div class="detail-item"><span class="detail-label">Date Signed:</span> ${player.dateSigned ? formatDate(player.dateSigned) : "N/A"}</div>
        </div>

        <div class="section">
          <div class="section-title">Contact Information</div>
          <div class="detail-item"><span class="detail-label">Email:</span> ${player.email || "N/A"}</div>
          <div class="detail-item"><span class="detail-label">Phone:</span> ${player.phone || "N/A"}</div>
        </div>

        ${
          player.manager
            ? `
          <div class="section">
            <div class="section-title">Manager Information</div>
            <div class="detail-item"><span class="detail-label">Name:</span> ${player.manager.fullname || "N/A"}</div>
            <div class="detail-item"><span class="detail-label">Phone:</span> ${player.manager.phone || "N/A"}</div>
          </div>
        `
            : ""
        }

        <div class="footer">
          Generated on ${new Date().toLocaleString()} • ${ENV.TEAM_NAME}
        </div>

        <script>
          window.onload = () => setTimeout(() => window.print(), 500);
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};

// React Component
interface PrintPlayersBtnProps {
  players?: IPlayer[];
  options?: { title?: string; showDetails?: boolean };
}

export function PrintPlayersBtn({ players, options }: PrintPlayersBtnProps) {
  const { data, isLoading } = useGetPlayersQuery(
    { limit: 100, status: "current" },
    {
      skip: !!players?.length,
    },
  );

  const playersToPrint = players || data?.data || [];

  return (
    <Button
      onClick={() => printPlayersList(playersToPrint, options)}
      variant="secondary"
      waiting={isLoading}
      disabled={!playersToPrint.length}
    >
      <Printer className="h-4 w-4 mr-2" />
      Print List
    </Button>
  );
}

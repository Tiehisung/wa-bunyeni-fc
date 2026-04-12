"use client";

import { ReactNode } from "react";
import {
  LayoutDashboard,
  FileText,
  Tv,
  Users,
  User,
  UserCheck,
  ClipboardList,
  HeartPulse,
  Newspaper,
  Wallet,
  Shield,
  Activity,
  Image,
  Target,
  Square,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function GroupedAdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r h-screen overflow-y-auto bg-card">
      {sidebarLinkGroups.map((group) => (
        <div key={group.label} className="mb-6">
          <h3 className="px-4 mb-2 text-xs font-semibold uppercase text-muted-foreground">
            {group.label}
          </h3>

          <div className="space-y-1">
            {group.links.map((item) => {
              const active = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition ${
                    active
                      ? "bg-primary "
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
export interface ILinkItem {
  title: string;
  path: string;
  icon?: ReactNode;
  children?: ILinkItem[];
  defaultOpen?: boolean;
}

export const sidebarLinkGroups: {
  label: string;
  links: ILinkItem[];
}[] = [
  {
    label: "Overview",
    links: [
      { title: "Dashboard", path: "/admin", icon: <LayoutDashboard /> },
      { title: "Docs", path: "/admin/docs", icon: <FileText /> },
    ],
  },

  {
    label: "Competition",
    links: [
      { title: "Matches", path: "/admin/matches", icon: <Target /> },
      {
        title: "Highlights",
        path: "/admin/matches/highlights",
        icon: <Activity />,
      },
      { title: "Live Match", path: "/admin/live-match", icon: <Tv /> },
    ],
  },

  {
    label: "Teams",
    links: [
      { title: "Teams", path: "/admin/features/teams", icon: <Users /> },
      { title: "Squad", path: "/admin/squad", icon: <Users /> },
      { title: "Players", path: "/admin/players", icon: <User /> },
      { title: "Managers", path: "/admin/managers", icon: <UserCheck /> },
    ],
  },

  {
    label: "Training & Fitness",
    links: [
      { title: "Training", path: "/admin/training", icon: <Activity /> },
      {
        title: "Attendance",
        path: "/admin/training/attendance",
        icon: <ClipboardList />,
      },
      { title: "Injuries", path: "/admin/injuries", icon: <HeartPulse /> },
    ],
  },

  {
    label: "Club Media",
    links: [
      { title: "News", path: "/admin/news", icon: <Newspaper /> },
      { title: "Gallery", path: "/admin/galleries", icon: <Image /> },
      { title: "Cards", path: "/admin/cards", icon: <Square /> },
    ],
  },

  {
    label: "Operations",
    links: [
      { title: "Sponsorship", path: "/admin/sponsorship", icon: <Wallet /> },
      { title: "Finance", path: "/admin/resources/finance", icon: <Wallet /> },
      { title: "Users", path: "/admin/users", icon: <Users /> },
      { title: "Logs", path: "/admin/logs", icon: <Shield /> },
      { title: "upload", path: "/admin/upload", icon: <Shield /> },
    ],
  },
];

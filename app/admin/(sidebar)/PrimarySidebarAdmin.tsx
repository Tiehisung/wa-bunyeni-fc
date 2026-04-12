"use client";

import {
  Activity,
  ActivityIcon,
  ClipboardList,
  FileText,
  HeartPulse,
  Home,
  Image,
  LayoutDashboard,
  Newspaper,
  Shield,
  Square,
  Target,
  Tv,
  User,
  UserCheck,
  Users,
  Wallet,
  LetterText,
  UserPlus,
  Trophy,
} from "lucide-react";
import { ILinkItem } from "./GroupedSidebarLinks";
import { PrimaryCollapsible } from "@/components/Collapsible";
 
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function PrimaryAdminSidebar() {
  return (
    <aside className="w-64 p-4 border-r ">
      {sidebarLinks.map((link, i) => (
        <SidebarLink key={i} item={link} />
      ))}
    </aside>
  );
}

export function SidebarLink({
  item,
  depth = 0,
}: {
  item: ILinkItem;
  depth?: number;
}) {
  const hasChildren = item.children?.length;
  const pathname = usePathname();
  const isActiveLink = (path: string) => pathname === path;

  if (!hasChildren)
    return (
      <div className="flex rounded ">
        <Link
          href={item.path}
          className={cn(
            "flex items-center gap-2 relative _hoverBefore flex-1 pl-1.5 py-1.5 mt-1 _hover text-sm transition-colors ",
            isActiveLink(item.path) ? "text-primary " : "",
          )}
        >
          {item.icon && (
            <span className="text-xl bg-white/30 rounded-full p-1.5">
              {item.icon}
            </span>
          )}

          {item.title}
        </Link>
      </div>
    );

  return (
    <PrimaryCollapsible
      header={{
        icon: item.icon,
        path: item.path,
        label: item.title,
        className: "ring-border font-normal text-sm ",
      }}
      defaultOpen={item.defaultOpen}
    >
      {item.children!.map((child, i) => (
        <SidebarLink key={i} item={child} depth={depth + 1} />
      ))}
    </PrimaryCollapsible>
  );
}

export const sidebarLinks: ILinkItem[] = [
  { title: "Home", path: "/", icon: <Home className="w-4 h-4" /> },
  {
    title: "Dashboard",
    path: "/admin",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    title: "Docs",
    path: "/admin/docs",
    icon: <FileText className="w-4 h-4" />,
  },

  {
    title: "Matches",
    path: "/admin/matches",
    icon: <Target className="w-4 h-4" />,

    children: [
      {
        title: "Matches",
        path: "/admin/matches",
        icon: <Target className="w-4 h-4" />,
      },
      {
        title: "Create Fixture",
        path: "/admin/matches/create-fixture",
        icon: <Newspaper className="w-4 h-4" />,
      },
      {
        title: "Live Match",
        path: "/admin/matches/live-match",
        icon: <Tv className="w-4 h-4" />,
      },

      {
        title: "Match Request",
        path: "/admin/matches/request",
        icon: <LetterText className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "News",
    path: "/admin/news",
    icon: <Newspaper className="w-4 h-4" />,
  },
  {
    title: "Media",
    path: "",
    icon: <Newspaper className="w-4 h-4" />,

    children: [
      {
        title: "News",
        path: "/admin/news",
        icon: <Newspaper className="w-4 h-4" />,
      },
      {
        title: "Gallery",
        path: "/admin/galleries",
        icon: <Image className="w-4 h-4" />,
      },

      {
        title: "Highlights",
        path: "/admin/highlights",
        icon: <ActivityIcon className="w-4 h-4" />,
      },
      {
        title: "Uploader",
        path: "/admin/upload",
        icon: <Image className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Players",
    path: "/admin/players",
    icon: <User className="w-4 h-4" />,

    children: [
      {
        title: "Captaincy",
        path: "/admin/players/captaincy",
        icon: <User className="w-4 h-4" />,
      },
      {
        title: "New Signing",
        path: "/admin/players/new",
        icon: <UserPlus className="w-4 h-4" />,
      },
      {
        title: "Players",
        path: "/admin/players",
        icon: <Users className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Teams",
    path: "/admin/teams",
    icon: <Users className="w-4 h-4" />,
  },
  { title: "Squad", path: "/admin/squad", icon: <Users className="w-4 h-4" /> },
  {
    title: "Cards",
    path: "/admin/cards",
    icon: <Square className="w-4 h-4" />,
  },
  {
    title: "MoTM",
    path: "/admin/matches/mvps",
    icon: <Trophy className="w-4 h-4" />,
  },
  {
    title: "Staff",
    path: "/admin/staff",
    icon: <UserCheck className="w-4 h-4" />,
  },

  {
    title: "Training & Fitness",
    path: "",
    icon: <Activity className="w-4 h-4" />,

    children: [
      {
        title: "Attendance",
        path: "/admin/training/attendance",
        icon: <ClipboardList className="w-4 h-4" />,
      },
      {
        title: "Injuries",
        path: "/admin/injuries",
        icon: <HeartPulse className="w-4 h-4" />,
      },
    ],
  },

  {
    title: "Operations",
    path: "",
    icon: <Wallet className="w-4 h-4" />,

    children: [
      {
        title: "Sponsorship",
        path: "/admin/sponsorship",
        icon: <Wallet className="w-4 h-4" />,
      },
      {
        title: "Finance",
        path: "/admin/resources/finance",
        icon: <Wallet className="w-4 h-4" />,
      },
      {
        title: "Users",
        path: "/admin/users",
        icon: <Users className="w-4 h-4" />,
      },
      {
        title: "Logs",
        path: "/admin/logs",
        icon: <Shield className="w-4 h-4" />,
      },
    ],
  },
];

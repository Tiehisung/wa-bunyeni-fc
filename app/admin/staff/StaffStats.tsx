// pages/admin/staff/components/StaffStats.tsx
import { Users, UserCheck, UserX, Calendar, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { IStaff } from "@/types/staff.interface";

interface StaffStatsProps {
  data: IStaff[];
}

export function StaffStats({ data }: StaffStatsProps) {
  const stats = {
    total: data.length,
    active: data.filter((s) => s.isActive).length,
    inactive: data.filter((s) => !s.isActive).length,
    roles: [...new Set(data.map((s) => s.role))].length,
    newThisMonth: data.filter((s) => {
      const date = new Date(s.dateSigned);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length,
  };

  const statCards = [
    {
      title: "Total Staff",
      value: stats.total,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Active",
      value: stats.active,
      icon: UserCheck,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Inactive",
      value: stats.inactive,
      icon: UserX,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      title: "Roles",
      value: stats.roles,
      icon: Award,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "New This Month",
      value: stats.newThisMonth,
      icon: Calendar,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

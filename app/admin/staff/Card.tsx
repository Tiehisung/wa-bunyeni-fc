"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials } from "@/lib";
import { formatDate, getTimeLeftOrAgo } from "@/lib/timeAndDate";
import { Calendar, Phone, Mail } from "lucide-react";
import StaffActionsPopper from "./Actions";
 
import { IStaff } from "@/types/staff.interface";
import { useRouter } from "next/navigation";

interface Props {
  viewStyle?: "list" | "grid";
  staff?: IStaff;
}
const AdminStaffCard = ({ viewStyle, staff }: Props) => {
  const router = useRouter();

  const getRoleBadgeVariant = (role: string) => {
    switch (role?.toLowerCase()) {
      case "coach":
        return "default";
      case "assistant":
        return "secondary";
      case "manager":
        return "destructive";
      case "medical":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (viewStyle == "list")
    return (
      <tr
        key={staff?._id}
        className="border-b hover:bg-muted/30 cursor-pointer"
        onClick={() => router.push(`/admin/staff/${staff?._id}`)}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={staff?.avatar} alt={staff?.fullname} />
              <AvatarFallback>
                {getInitials(staff?.fullname as string)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{staff?.fullname}</div>
              <div className="text-sm text-muted-foreground">
                {staff?.email}
              </div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <Badge variant={getRoleBadgeVariant(staff?.role as string)}>
            {staff?.role}
          </Badge>
        </td>
        <td className="px-4 py-3">
          <div className="text-sm">{staff?.phone}</div>
        </td>
        <td className="px-4 py-3">
          <div className="text-sm">
            {formatDate(staff?.dateSigned, "dd/mm/yyyy")}
          </div>
        </td>
        <td className="px-4 py-3">
          <Badge variant={staff?.isActive ? "default" : "secondary"}>
            {staff?.isActive ? "Active" : "Inactive"}
          </Badge>
        </td>
        <td
          className="px-4 py-3 text-right"
          onClick={(e) => e.stopPropagation()}
        >
          <StaffActionsPopper staff={staff as IStaff} />
        </td>
      </tr>
    );
  return (
    <Card
      key={staff?._id}
      className="group relative overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
      onClick={() => router.push(`/admin/staff/${staff?._id}`)}
    >
      {/* Header with gradient */}
      <div className="h-24 bg-linear-to-r from-primary/20 to-primary/5" />

      {/* Avatar */}
      <div className="absolute left-1/2 -translate-x-1/2 top-2 ">
        <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
          <AvatarImage src={staff?.avatar} alt={staff?.fullname} />
          <AvatarFallback className="text-lg">
            {getInitials(staff?.fullname as string)}
          </AvatarFallback>
        </Avatar>
      </div>

      <CardContent className="pt-12 pb-4">
        {/* Name and Role */}
        <div className="text-center mb-4">
          <h3 className="font-semibold text-lg">{staff?.fullname}</h3>
          <Badge variant="secondary" className="mt-1">
            {staff?.role}
          </Badge>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="truncate">{staff?.email}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{staff?.phone}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate(staff?.dateSigned, "dd/mm/yyyy")}
              <span className="text-xs ml-1">
                ({getTimeLeftOrAgo(staff?.dateSigned).formatted})
              </span>
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-4 flex justify-center">
          <Badge variant={staff?.isActive ? "default" : "secondary"}>
            {staff?.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Actions Menu */}
        <div
          className="absolute top-2 right-2 "
          onClick={(e) => e.stopPropagation()}
        >
          <StaffActionsPopper
            staff={staff as IStaff}
            onEdit={() => router.push(`/admin/staff/edit?staffId=${staff?._id}`)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminStaffCard;

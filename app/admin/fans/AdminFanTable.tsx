"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
  Award as AwardIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import { EFanBadge } from "@/types/fan.interface";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetFanLeaderboardQuery } from "@/services/fans.endpoints";

interface AdminFanTableProps {
  sortBy?: "points" | "engagementScore";
  showAll?: boolean;
}

export function AdminFanTable({
  sortBy = "points",
  showAll = false,
}: AdminFanTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"points" | "engagementScore">(
    sortBy,
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedFan, setSelectedFan] = useState<any>(null);

  const { data: leaderboard, isLoading } = useGetFanLeaderboardQuery({
    limit: showAll ? 100 : 20,
    sortBy: sortField,
  });

  const filteredFans = leaderboard?.data?.filter((fan) =>
    fan?.user?.name?.toLowerCase()?.includes(search.toLowerCase()),
  );

  const sortedFans = [...(filteredFans || [])].sort((a, b) => {
    const aVal = sortField === "points" ? a.points : a.engagementScore;
    const bVal = sortField === "points" ? b.points : b.engagementScore;
    return sortDirection === "desc" ? bVal - aVal : aVal - bVal;
  });

  const handleSort = (field: "points" | "engagementScore") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  if (isLoading) {
    return <AdminFanTableSkeleton />;
  }

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-0">
        {/* Search Bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search fans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium">
                  Rank
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium">Fan</th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort("points")}
                >
                  <div className="flex items-center gap-1">
                    Points
                    {sortField === "points" &&
                      (sortDirection === "desc" ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronUp className="h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort("engagementScore")}
                >
                  <div className="flex items-center gap-1">
                    Engagement
                    {sortField === "engagementScore" &&
                      (sortDirection === "desc" ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronUp className="h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium">
                  Badges
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedFans.map((entry) => (
                <tr
                  key={entry.user._id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span
                      className={`font-semibold ${entry.rank <= 3 ? "text-primary" : ""}`}
                    >
                      #{entry.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={entry.user.avatar} />
                        <AvatarFallback>
                          {entry.user.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{entry.user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    {entry.points.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${entry.engagementScore}%` }}
                        />
                      </div>
                      <span className="text-xs ml-2">
                        {entry.engagementScore}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {entry.badges.slice(0, 2).map((badge) => (
                        <Badge
                          key={badge}
                          variant="outline"
                          className="text-xs"
                        >
                          {badge}
                        </Badge>
                      ))}
                      {entry.badges.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{entry.badges.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFan(entry)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Fan Details</DialogTitle>
                        </DialogHeader>
                        {selectedFan && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={selectedFan.user.avatar} />
                                <AvatarFallback>
                                  {selectedFan.user.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">
                                  {selectedFan.user.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {selectedFan.user.email}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-muted/30 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-primary">
                                  {selectedFan.points}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Total Points
                                </p>
                              </div>
                              <div className="bg-muted/30 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-primary">
                                  {selectedFan.engagementScore}%
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Engagement
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-2">Badges</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedFan.badges.map((badge: EFanBadge) => (
                                  <Badge key={badge} variant="secondary">
                                    {badge}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-2">
                                Contributions
                              </p>
                              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                <div>
                                  <p className="font-semibold">
                                    {selectedFan.contributions.comments}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Comments
                                  </p>
                                </div>
                                <div>
                                  <p className="font-semibold">
                                    {selectedFan.contributions.reactions}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Reactions
                                  </p>
                                </div>
                                <div>
                                  <p className="font-semibold">
                                    {selectedFan.contributions.shares}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Shares
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedFans?.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No fans found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AdminFanTableSkeleton() {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="divide-y">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

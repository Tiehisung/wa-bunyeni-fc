'use client'

import {
  useGetFanLeaderboardQuery,
  useGetFanStatsQuery,
  useRegisterAsFanMutation,
} from "@/services/fans.endpoints";
 
import { useState, useMemo } from "react";
 
import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  Star,
  Heart,
  TrendingUp,
  Award,
  Calendar,
  MessageSquare,
  Share2,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
 
 
const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Medal className="w-6 h-6 text-amber-600" />;
    default:
      return <Star className="w-5 h-5 text-muted-foreground" />;
  }
};

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return <Badge className="bg-yellow-500 text-black">#1 Super Fan</Badge>;
    case 2:
      return <Badge className="bg-gray-400 text-black">#2 Elite Fan</Badge>;
    case 3:
      return <Badge className="bg-amber-600">#3 Top Fan</Badge>;
    default:
      return <Badge variant="outline">Top {rank}</Badge>;
  }
};

export default function TopFans() {
  const { data:session } = useSession();
  
  const user=session?.user

  const { data: fans, isLoading: fansLoading } = useGetFanLeaderboardQuery({
    limit: 50,
    sortBy: "fanPoints",
  });

  console.log(fans, fansLoading);

  const { data: stats } = useGetFanStatsQuery();
  console.log(stats);
  const [registerAsFan] = useRegisterAsFanMutation();

  const _handleRegisterAsFan = async () => {
    if (user?.id) {
      await registerAsFan(user.id);
    }
  };

  // Show register button if user is not a fan
  const showRegisterButton = !user
  console.log(showRegisterButton, _handleRegisterAsFan);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("points");

  const sortedFans = useMemo(() => {
    let sorted = [...(fans ?? [])];

    if (activeTab === "points") {
      sorted.sort((a, b) => b.fanPoints - a.fanPoints);
    } else if (activeTab === "engagement") {
      sorted.sort((a, b) => b.engagementScore - a.engagementScore);
    } else if (activeTab === "comments") {
      sorted.sort(
        (a, b) => b.contributions.comments - a.contributions.comments,
      );
    }

    if (searchTerm) {
      sorted = sorted.filter((fan) =>
        fan.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return sorted;
  }, [activeTab, searchTerm]);

  const totalFans = fans?.length || 0;
  const totalPoints = (fans ?? []).reduce((sum, fan) => sum + fan.fanPoints, 0);
  const averageEngagement = Math.round(
    (fans ?? []).reduce((sum, fan) => sum + fan.engagementScore, 0) / totalFans,
  );

  return (
    <>
     

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative bg-linear-to-r from-primary/20 via-primary/10 to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/20 rounded-full">
                  <Heart className="w-8 h-8 text-primaryRed" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Top Fans Leaderboard
              </h1>
              <p className="text-muted-foreground">
                Celebrating our most dedicated supporters who make our community
                special. Earn points by engaging with content, attending
                matches, and sharing your passion!
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="container mx-auto px-4 -mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Fans</p>
                    <p className="text-2xl font-bold">{totalFans}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Points
                    </p>
                    <p className="text-2xl font-bold">
                      {totalPoints.toLocaleString()}
                    </p>
                  </div>
                  <Trophy className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Avg Engagement
                    </p>
                    <p className="text-2xl font-bold">{averageEngagement}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-xl">Fan Leaderboard</CardTitle>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="Search fans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64"
                  />
                </div>
              </div>

              <Tabs
                defaultValue="points"
                className="mt-6"
                onValueChange={setActiveTab}
              >
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="points">
                    <Trophy className="w-4 h-4 mr-2" /> Points
                  </TabsTrigger>
                  <TabsTrigger value="engagement">
                    <TrendingUp className="w-4 h-4 mr-2" /> Engagement
                  </TabsTrigger>
                  <TabsTrigger value="comments">
                    <Heart className="w-4 h-4 mr-2" /> Most Comments
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="space-y-4">
                {sortedFans.map((fan, index) => (
                  <motion.div
                    key={fan._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md",
                      index < 3 &&
                        "bg-linear-to-r from-primary/5 to-transparent",
                    )}
                  >
                    {/* Rank */}
                    <div className="shrink-0 w-12 text-center">
                      <div className="flex justify-center">
                        {getRankIcon(index + 1)}
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 block">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Avatar & Info */}
                    <div className="shrink-0">
                      <Avatar className="h-14 w-14 border-2 border-primary/20">
                        <AvatarImage src={fan.avatar} alt={fan.name} />
                        <AvatarFallback>
                          {fan.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {/* <AVATAR/> */}
                    </div>

                    {/* Name & fanBadges */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{fan.name}</h3>
                        {getRankBadge(index + 1)}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {fan.fanBadges.slice(0, 3).map((badge, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs"
                          >
                            <Award className="w-3 h-3 mr-1" />
                            {badge}
                          </Badge>
                        ))}
                        {fan.fanBadges.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{fan.fanBadges.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {activeTab === "points"
                            ? fan.fanPoints.toLocaleString()
                            : activeTab === "engagement"
                              ? `${fan.engagementScore}%`
                              : fan.contributions.comments}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activeTab === "points"
                            ? "points"
                            : activeTab === "engagement"
                              ? "engagement"
                              : "comments"}
                        </p>
                      </div>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>⚡ {fan.contributions.reactions} reactions</span>
                        <span>📤 {fan.contributions.shares} shares</span>
                        <span>
                          🏟️ {fan.contributions.matchAttendance} matches
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {sortedFans.length === 0 && (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">
                      No fans found matching your search.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* How to Earn Points Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">How to Earn Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <Heart className="w-6 h-6 mx-auto mb-2 text-primaryRed" />
                  <p className="font-semibold">React</p>
                  <p className="text-xs text-muted-foreground">+5 points</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <MessageSquare className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <p className="font-semibold">Comment</p>
                  <p className="text-xs text-muted-foreground">+10 points</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <Share2 className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <p className="font-semibold">Share</p>
                  <p className="text-xs text-muted-foreground">+15 points</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <p className="font-semibold">Attend Match</p>
                  <p className="text-xs text-muted-foreground">+50 points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

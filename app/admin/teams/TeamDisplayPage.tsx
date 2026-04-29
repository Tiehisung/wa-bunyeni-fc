// // pages/TeamDisplayPage.tsx
// import { useState, useMemo } from "react";
// import { Helmet } from "react-helmet";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import {
//   ArrowLeft,
//   Edit,
//   Trash2,
//   MapPin,
//   Phone,
//   User,
//   Calendar,
//   Globe,
//   ExternalLink,
// } from "lucide-react";

// import { Button } from "@/components/buttons/Button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ConfirmDialog } from "@/components/Confirm-dialog";
// import {
//   useGetTeamByIdQuery,
//   useDeleteTeamMutation,
// } from "@/services/team.endpoints";
// import { useGetMatchesByTeamQuery } from "@/services/match.endpoints";
// import { TeamForm } from "./TeamForm";
// import Loader from "@/components/loaders/Loader";
// import { formatDate } from "@/lib/timeAndDate";
// import { toast } from "sonner";
// import { getErrorMessage } from "@/lib/error";

// // Match Card Component
// const MatchCard = ({ match }: { match: any }) => {
// //   const date = new Date(match.date);
//   const isUpcoming = match.status === "UPCOMING";

//   return (
//     <div className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow">
//       <div className="flex items-center gap-3">
//         <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
//           {match?.isHome ? (
//             <img
//               src={match.opponent?.logo}
//               alt={match.opponent?.name}
//               className="w-10 h-10 object-contain"
//             />
//           ) : (
//             <img
//               src={match.homeTeam?.logo}
//               alt={match.homeTeam?.name}
//               className="w-10 h-10 object-contain"
//             />
//           )}
//         </div>
//         <div>
//           <p className="font-medium">
//             {match?.isHome ? match.opponent?.name : match.homeTeam?.name}
//           </p>
//           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//             <Calendar className="h-3 w-3" />
//             <span>{formatDate(match.date)}</span>
//             {match.time && <span>• {match.time}</span>}
//           </div>
//         </div>
//       </div>

//       {isUpcoming ? (
//         <Badge variant="outline">Upcoming</Badge>
//       ) : (
//         <div className="text-right">
//           <p className="font-bold text-lg">
//             {match.homeScore} - {match.awayScore}
//           </p>
//           <Badge variant={match.result === "win" ? "default" : "secondary"}>
//             {match.result === "win"
//               ? "Win"
//               : match.result === "loss"
//                 ? "Loss"
//                 : "Draw"}
//           </Badge>
//         </div>
//       )}
//     </div>
//   );
// };

// // Main Team Display Component
// export default function TeamDisplayPage() {
//   const { teamId  }  = useParams<{ teamId: string }>();
//   const navigate = useNavigate();
//   const [isEditing, setIsEditing] = useState(false);

//   const {
//     data: teamData,
//     isLoading,
//     error,
//   } = useGetTeamByIdQuery(teamId || "");
//   const { data: matchesData } = useGetMatchesByTeamQuery({ teamId: teamId ||''});
//   const [deleteTeam] = useDeleteTeamMutation();

//   const team = teamData?.data;

//   const handleDelete = async () => {
//     try {
//       const result = await deleteTeam(teamId || "").unwrap();
//       if (result.success) {
//         toast.success(result.message);
//         navigate("/admin/teams");
//       }
//     } catch (error) {
//       toast.error(getErrorMessage(error, "Failed to delete team"));
//     }
//   };

//   // Calculate head-to-head stats
//   const headToHeadStats = useMemo(() => {
//     if (!matchesData?.data)
//       return { wins: 0, losses: 0, draws: 0, totalGoals: 0 };

//     const matches = matchesData.data;
//     const wins = matches.filter((m) => m.computed.result === "win").length;
//     const losses = matches.filter((m) => m.computed.result === "loss").length;
//     const draws = matches.filter((m) => m.computed.result === "draw").length;
//     const totalGoals = matches.reduce(
//       (sum, m) => sum + (m.computed?.score || 0) + (m.awayScore || 0),
//       0,
//     );

//     return { wins, losses, draws, totalGoals, totalMatches: matches.length };
//   }, [matchesData]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader message="Loading team information..." />
//       </div>
//     );
//   }

//   if (error || !team) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Card className="p-6 text-center max-w-md">
//           <h2 className="text-xl font-bold text-red-500 mb-2">
//             Team Not Found
//           </h2>
//           <p className="text-muted-foreground mb-4">
//             The team you're looking for doesn't exist or has been removed.
//           </p>
//           <Button
//             onClick={() => navigate("/admin/teams")}
//             primaryText="Back to Teams"
//           />
//         </Card>
//       </div>
//     );
//   }

//   if (isEditing) {
//     return (
//       <div className="container mx-auto px-4 py-8 max-w-4xl">
//         <Button
//           onClick={() => setIsEditing(false)}
//           variant="ghost"
//           className="mb-4"
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to Team
//         </Button>
//         <TeamForm team={team} onSuccess={() => setIsEditing(false)} />
//       </div>
//     );
//   }

//   return (
//     <>
//       <Helmet>
//         <title>{team.name} | Team Profile</title>
//         <meta
//           name="description"
//           content={`Profile of ${team.name} - Head-to-head records, matches, and team information.`}
//         />
//         <meta property="og:title" content={`${team.name} - Team Profile`} />
//         <meta property="og:image" content={team.logo} />
//       </Helmet>

//       <div className="min-h-screen bg-background">
//         {/* Back Button */}
//         <div className="container mx-auto px-4 pt-6">
//           <Button
//             onClick={() => navigate("/admin/teams")}
//             variant="ghost"
//             size="sm"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Teams
//           </Button>
//         </div>

//         {/* Hero Section */}
//         <div className="bg-linear-to-r from-primary/10 to-primary/5 border-b">
//           <div className="container mx-auto px-4 py-8">
//             <div className="flex flex-col md:flex-row items-center gap-6">
//               {/* Team Logo */}
//               <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white shadow-lg p-4 flex items-center justify-center">
//                 <img
//                   src={team.logo}
//                   alt={team.name}
//                   className="w-full h-full object-contain"
//                 />
//               </div>

//               {/* Team Info */}
//               <div className="flex-1 text-center md:text-left">
//                 <h1 className="text-3xl md:text-4xl font-bold mb-2">
//                   {team.name}
//                 </h1>
//                 <p className="text-muted-foreground mb-4">{team.alias}</p>
//                 <div className="flex flex-wrap justify-center md:justify-start gap-4">
//                   <Badge variant="secondary" className="gap-1">
//                     <MapPin className="h-3 w-3" />
//                     {team.community}
//                   </Badge>
//                   <Badge variant="secondary" className="gap-1">
//                     <Calendar className="h-3 w-3" />
//                     Since {formatDate(team.createdAt, "yyyy")}
//                   </Badge>
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex gap-2">
//                 <Button
//                   onClick={() => setIsEditing(true)}
//                   variant="outline"
//                   className="gap-2"
//                 >
//                   <Edit className="h-4 w-4" />
//                   Edit
//                 </Button>
//                 <ConfirmDialog
//                   title={`Delete ${team.name}`}
//                   description={`Are you sure you want to delete "${team.name}"? This action cannot be undone and will remove all match records associated with this team.`}
//                   onConfirm={handleDelete}
//                   trigger={
//                     <Button variant="destructive" className="gap-2">
//                       <Trash2 className="h-4 w-4" />
//                       Delete
//                     </Button>
//                   }
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="container mx-auto px-4 py-8 max-w-6xl">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Left Column - Contact Info */}
//             <div className="space-y-6">
//               {/* Contact Information */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg">Contact Information</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <div className="flex items-center gap-3">
//                     <User className="h-4 w-4 text-muted-foreground" />
//                     <span>{team.contactName}</span>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <Phone className="h-4 w-4 text-muted-foreground" />
//                     <a href={`tel:${team.contact}`} className="hover:underline">
//                       {team.contact}
//                     </a>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <MapPin className="h-4 w-4 text-muted-foreground" />
//                     <span>{team.community}</span>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <Globe className="h-4 w-4 text-muted-foreground" />
//                     <Link
//                       to={`/teams/${team._id}`}
//                       className="hover:underline text-primary"
//                     >
//                       View Profile{" "}
//                       <ExternalLink className="h-3 w-3 inline ml-1" />
//                     </Link>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Head-to-Head Stats */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg">Head-to-Head Record</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-3 gap-4 text-center">
//                     <div>
//                       <p className="text-2xl font-bold text-green-600">
//                         {headToHeadStats.wins}
//                       </p>
//                       <p className="text-xs text-muted-foreground">Wins</p>
//                     </div>
//                     <div>
//                       <p className="text-2xl font-bold text-yellow-600">
//                         {headToHeadStats.draws}
//                       </p>
//                       <p className="text-xs text-muted-foreground">Draws</p>
//                     </div>
//                     <div>
//                       <p className="text-2xl font-bold text-red-600">
//                         {headToHeadStats.losses}
//                       </p>
//                       <p className="text-xs text-muted-foreground">Losses</p>
//                     </div>
//                   </div>
//                   <Separator className="my-4" />
//                   <div className="text-center">
//                     <p className="text-sm text-muted-foreground">
//                       Total Matches
//                     </p>
//                     <p className="text-xl font-bold">
//                       {headToHeadStats.totalMatches}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Right Column - Matches */}
//             <div className="lg:col-span-2 space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg">Match History</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <Tabs defaultValue="all" className="space-y-4">
//                     <TabsList>
//                       <TabsTrigger value="all">All Matches</TabsTrigger>
//                       <TabsTrigger value="home">Home Games</TabsTrigger>
//                       <TabsTrigger value="away">Away Games</TabsTrigger>
//                     </TabsList>

//                     <TabsContent value="all" className="space-y-3">
//                       {matchesData?.data?.length === 0 ? (
//                         <p className="text-center text-muted-foreground py-8">
//                           No matches recorded against this team yet.
//                         </p>
//                       ) : (
//                         matchesData?.data?.map((match) => (
//                           <MatchCard
//                             key={match._id}
//                             match={match}
//                             isHome={match.homeTeam?._id === team._id}
//                           />
//                         ))
//                       )}
//                     </TabsContent>

//                     <TabsContent value="home" className="space-y-3">
//                       {matchesData?.data?.filter(
//                         (m) => m.homeTeam?._id === team._id,
//                       ).length === 0 ? (
//                         <p className="text-center text-muted-foreground py-8">
//                           No home matches recorded against this team.
//                         </p>
//                       ) : (
//                         matchesData?.data
//                           ?.filter((m) => m.homeTeam?._id === team._id)
//                           .map((match) => (
//                             <MatchCard key={match._id} match={match} isHome />
//                           ))
//                       )}
//                     </TabsContent>

//                     <TabsContent value="away" className="space-y-3">
//                       {matchesData?.data?.filter(
//                         (m) => m.awayTeam?._id === team._id,
//                       ).length === 0 ? (
//                         <p className="text-center text-muted-foreground py-8">
//                           No away matches recorded against this team.
//                         </p>
//                       ) : (
//                         matchesData?.data
//                           ?.filter((m) => m.awayTeam?._id === team._id)
//                           .map((match) => (
//                             <MatchCard
//                               key={match._id}
//                               match={match}
//                               isHome={false}
//                             />
//                           ))
//                       )}
//                     </TabsContent>
//                   </Tabs>
//                 </CardContent>
//               </Card>

//               {/* Quick Actions */}
//               <Card className="bg-muted/30">
//                 <CardContent className="p-6">
//                   <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                     <div>
//                       <h3 className="font-semibold">Schedule a Match</h3>
//                       <p className="text-sm text-muted-foreground">
//                         Create a new fixture against {team.name}
//                       </p>
//                     </div>
//                     <Button
//                       onClick={() =>
//                         navigate(`/admin/matches/create?opponentId=${team._id}`)
//                       }
//                       primaryText="Create Fixture"
//                       size="sm"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

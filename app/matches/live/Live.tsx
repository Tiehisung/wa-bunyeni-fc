import { checkMatchMetrics, checkTeams } from "@/lib/compute/match";
import { LuDot } from "react-icons/lu";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Updator } from "@/components/Updator";
import { IMatch } from "@/types/match.interface";
import { useGetLiveMatchQuery } from "@/services/match.endpoints";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const LiveMatchCard = () => {
  const { data, isLoading, error } = useGetLiveMatchQuery({});

  const match    = data?.data as IMatch;

  if (isLoading) {
    return (
      <div className="_page px-4 flex justify-center items-center min-h-50">
        <Loader message="Loading live match..." />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="_page px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Live Match</AlertTitle>
          <AlertDescription>
            There is no live match at the moment.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { home, away } = checkTeams(match);
  const matchMetrics = checkMatchMetrics(match);

  return (
    <div className="_page px-4">
      <h1 className="uppercase rounded-full p-2 w-fit bg-primaryGreen px-3 shadow-2xl _title">
        Live Match Update
      </h1>
      <Card>
        <CardHeader className="flex items-center gap-1.5 mb-2">
          <span className="bg-primaryRed my-0.5">LIVE</span>
          <span className="_p">Konjieh JHS park</span>
          <span className="text-xl font-thin text-emerald-400">{`56'`}</span>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between gap-5">
            <section className="flex flex-col items-center space-y-2">
              <img
                src={home?.logo as string}
                alt="home logo"
                className="w-12 h-12"
              />
              <span className="_label">{home?.name}</span>
            </section>
            <section className="flex items-center gap-1">
              <span className="text-2xl font-bold">
                {matchMetrics.goals.home}
              </span>
              <LuDot size={24} />
              <span className="text-2xl font-bold">
                {matchMetrics.goals.away}
              </span>
            </section>
            <section className="flex flex-col items-center space-y-2">
              <img
                src={away?.logo as string}
                alt="away logo"
                className="w-12 h-12"
              />
              <span className="_label">{away?.name}</span>
            </section>
          </div>
        </CardContent>
        <CardFooter className="h-10">
          <Updator random />
        </CardFooter>
      </Card>
    </div>
  );
};

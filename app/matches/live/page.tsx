'use client'
import { LiveMatchEvents } from "./LiveEventsDisplay";
import { checkMatchMetrics } from "@/lib/compute/match";
import HEADER from "@/components/Element";
import { MdOutlineLiveTv } from "react-icons/md";
import { IMatch } from "@/types/match.interface";
import { useGetLiveMatchQuery } from "@/services/match.endpoints";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LiveMatchPage() {
  const { data, isLoading, error } = useGetLiveMatchQuery({});

  const match  = data?.data as IMatch ;

  if (isLoading) {
    return (
      <div>
        <HEADER title="Live Match">
          <MdOutlineLiveTv className="text-Red" />
        </HEADER>
        <div className="container mx-auto p-4 _page flex justify-center items-center min-h-100">
          <Loader message="Loading live match..." />
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div>
        <HEADER title="Live Match">
          <MdOutlineLiveTv className="text-Red" />
        </HEADER>
        <div className="container mx-auto p-4 _page">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Live Match</AlertTitle>
            <AlertDescription>
              There is no live match at the moment. Please check back later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const {
    goals,
    teams: { home, away },
  } = checkMatchMetrics(match);

  return (
    <div className="">
      <HEADER title="Live Match">
        <MdOutlineLiveTv className="text-Red" />
      </HEADER>
      <div className="container mx-auto p-4 _page">
        <h1 className="text-2xl font-bold mb-4 text-primaryRed">
          Live Match Update
        </h1>
        <div className="my-6 _card rounded-tl-3xl rounded-br-3xl sm:flex items-center justify-between gap-6">
          <img
            src={home?.logo as string}
            alt={home?.name ?? ""}
            className="aspect-square h-20 w-20 md:h-44 md:w-44 object-cover"
          />
          <div className="flex flex-col justify-center items-center">
            <div className="text-xl md:text-2xl font-black uppercase">
              {home?.name}
            </div>
            <div className="mx-auto text-2xl text-center">
              {goals?.home ?? 0} - {goals?.away ?? 0}
            </div>
            <div className="text-xl md:text-2xl font-black uppercase">
              {away?.name}
            </div>
          </div>
          <img
            src={away?.logo as string}
            alt={away?.name ?? ""}
            className="aspect-square h-20 w-20 md:h-44 md:w-44 object-cover"
          />
        </div>

        <br />
      </div>

      <section className="">
        <LiveMatchEvents match={match} />
      </section>
    </div>
  );
}

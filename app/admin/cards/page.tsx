"use client";

 
import HEADER from "@/components/Element";
import BackToTopButton from "@/components/scroll/ToTopBtn";
import { CardsManager } from "./CardsManager";
import Loader from "@/components/loaders/Loader";
import { useGetCardsQuery } from "@/services/cards.endpoints";
 

export default function CardsPage() {
 
  const { data, isLoading } = useGetCardsQuery(window.location.search);

  if (isLoading && !data) {
    return (
      <div>
        <HEADER
          title="Cards Management"
          subtitle="Track and manage player cards"
        />
        <div className="_page flex justify-center items-center min-h-100">
          <Loader message="Loading cards..." />
        </div>
        <BackToTopButton />
      </div>
    );
  }

  return (
    <div>
      <HEADER
        title="Cards Management"
        subtitle="Track and manage player cards"
      />

      <div className="_page">
        <CardsManager cardsData={data} />
      </div>

      <BackToTopButton />
    </div>
  );
}

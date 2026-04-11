"use client";

import { PrimarySearch } from "@/components/Search";
import { IMatch } from "@/types/match.interface";
import { useGetPlayersQuery } from "@/services/player.endpoints";

interface IProps {
  matches?: IMatch[];
}

export function SearchHighlights({ matches }: IProps) {
  const { data: playersData } = useGetPlayersQuery("");

  const matchTitles = matches?.map((m) => `${m.title} ${m.date}`) ?? [];
  return (
    <div className="my-8 border-b pb-3 flex items-center flex-wrap gap-3">
      <PrimarySearch
        type="search"
        datalist={(playersData?.data ?? [])
          ?.map((p) => `${p?.firstName} ${p?.lastName}`)
          .concat(matchTitles)}
        listId="highlight-search"
        searchKey="highlight_search"
        placeholder="Search Highlights"
        inputStyles="h-10"
      />
    </div>
  );
}

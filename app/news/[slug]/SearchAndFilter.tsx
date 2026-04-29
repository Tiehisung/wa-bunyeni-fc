 

import { ClearFiltersBtn } from "@/components/buttons/ClearFilters";
import { PrimarySearch } from "@/components/Search";
import { QueryUpdator } from "@/components/SearchParamsUpdator";

export function SearchAndFilterNews() {
  return (
    <div className="space-y-1.5">
      <PrimarySearch
        searchKey="news_search"
        placeholder="Search News"
        type="search"
      />
      <QueryUpdator
        options={[
          {
            label: "Current",
            value: "",
            query: "isArchived",
          },
          {
            label: "Archived",
            value: "false",
            query: "isArchived",
          },
          {
            label: "Trending",
            value: "true",
            query: "isTrending",
          },
          {
            label: "Latest",
            value: "true",
            query: "isLatest",
          },
        ]}
      />

      <ClearFiltersBtn/>
    </div>
  );
}

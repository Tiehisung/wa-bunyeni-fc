"use client";

import { IPlayer } from "@/types/player.interface";
import { ClearFiltersBtn } from "@/components/buttons/ClearFilters";
import { PrimaryCollapsible } from "@/components/Collapsible";
import { PrimarySearch } from "@/components/Search";
import MultiSelectionInput from "@/components/select/MultiSelect";

export function SearchGallery({ players }: { players?: IPlayer[] }) {
  return (
    <div className="my-8 space-y-2 border-b pb-3">
      <PrimarySearch
        type="search"
        datalist={(players ?? [])?.map((p) => `${p?.firstName} ${p?.lastName}`)}
        listId="players-search"
        searchKey="gallery_search"
        placeholder="Search Galleries"
        inputStyles="h-10"
      />

      {(players?.length ?? 0) > 0 && (
        <div className="w-full flex items-start max-md:flex-wrap gap-4">
          <PrimaryCollapsible
            header={{
              icon: "#",
              label: (
                <span className=" text-sm px-2 py-0.5 rounded font-light">
                  Tag Players
                </span>
              ),
            }}variant={'outline'}
          >
            <MultiSelectionInput
              name="tags"
              options={players?.map((p) => ({
                label: `${p?.firstName} ${p?.lastName}`,
                value: p?._id,
              }))}
              className="rounded-full"
            />
          </PrimaryCollapsible>

          <ClearFiltersBtn label="Clear" className="ml-auto" />
        </div>
      )}
    </div>
  );
}

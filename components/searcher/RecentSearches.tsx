'use client'

import { Clock, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { Button } from "../buttons/Button";

import { debounce } from "@/lib/debounce";
import { fireEscape } from "@/hooks/Esc";
import { useRouter } from "next/navigation";

const RecentSearches = () => {
  const router = useRouter();

  const getTypeColor = (type: string) => {
    switch (type) {
      case "player":
        return "bg-blue-100 text-blue-800";
      case "match":
        return "bg-green-100 text-green-800";
      case "news":
        return "bg-purple-100 text-purple-800";
      case "sponsor":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const { recentSearches, addSearch, removeSearch, clearAll } =
    useRecentSearches();

  if (recentSearches.length > 0)
    return (
      <div className="p-2">
        <div className="flex items-center justify-between px-2 py-1">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Recent Searches
          </h4>
          <button
            onClick={clearAll}
            className="text-xs text-red-500 hover:text-red-600"
          >
            Clear All
          </button>
        </div>
        {recentSearches.map((search) => (
          <div
            key={search.id}
            className="w-full text-left hover:bg-muted transition-colors flex items-center justify-between group"
          >
            <Button
              variant="ghost"
              onClick={debounce(() => {
                router.push(search.url as string, {});
                addSearch(search);
                fireEscape();
              }, 500)}
              className="flex-1 gap-2 justify-start "
              size={"lg"}
            >
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm line-clamp-1">{search.query}</span>
              {search.type && (
                <Badge className={getTypeColor(search.type)}>
                  {search.type}
                </Badge>
              )}
            </Button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeSearch(search.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-red-500" />
            </button>
          </div>
        ))}
      </div>
    );
  return null;
};

export default RecentSearches;

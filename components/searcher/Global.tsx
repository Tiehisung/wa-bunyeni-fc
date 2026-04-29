"use client";

import { useState, useEffect } from "react";

import { Loader2 } from "lucide-react";
import {
  useLazyGlobalSearchQuery,
  useLazyQuickSearchQuery,
} from "@/services/search.endpoints";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PrimarySearchWithSelect } from "./Search";
import RecentSearches from "./RecentSearches";
import useGetParam from "@/hooks/params";
import { fireEscape } from "@/hooks/Esc";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { debounce } from "@/lib/debounce";

export function GlobalSearch() {
  const router = useRouter();

  const searchTerm = useGetParam("search");
  const q_types = useGetParam("s_source");

  const [isOpen, setIsOpen] = useState(false);
  const [showRecent, setShowRecent] = useState(true);
  const isMobile = useIsMobile();

  const [triggerSearch, { data: searchResults, isLoading }] =
    useLazyGlobalSearchQuery();

  const [triggerQuickSearch, { data: quickResults }] =
    useLazyQuickSearchQuery();
  const { addSearch } = useRecentSearches();

  // Debounced search
  const debouncedSearch = debounce((term: string) => {
    if (term.length >= 2) {
      triggerSearch({ q: term, limit: 10, types: q_types });
      setShowRecent(false);
    } else {
      setShowRecent(true);
    }
  }, 500);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      debouncedSearch(searchTerm);
      triggerQuickSearch(searchTerm);
      setIsOpen(true);
    } else if (searchTerm.length === 0) {
      setShowRecent(true);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm]);

  const handleResultClick = (result: any) => {
    // Store the clicked search in recent searches
    addSearch({
      query: result.title || result.label,
      type: result.type,
      url: result.url,
    });

    // setSearchTerm("");
    setIsOpen(false);
    router.push(result.url);
    fireEscape();
  };

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

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <PrimarySearchWithSelect
        searchKey="search"
        others={{ autoFocus: !isMobile }}
      />
      {/* Recent Searches Section - Only show when no search term */}
      {!isLoading && showRecent && !searchTerm && <RecentSearches />}
      {/* Search Results Dropdown */}
      {isOpen && searchTerm && (
        <Card
          className={` top-full left-0 right-0 mt-2  overflow-y-auto z-50 shadow-xl 
                     absolute max-h-96
                     `}
        >
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}

          {/* Quick Suggestions (while typing) */}
          {!isLoading &&
            quickResults &&
            quickResults.length > 0 &&
            searchTerm.length >= 2 && (
              <div className="p-2 bg-muted/30">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground px-2 py-1">
                  Suggestions
                </h4>
                {quickResults.map((result) => (
                  <button
                    key={result.value}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left px-4 py-2 hover:bg-muted transition-colors flex items-center gap-3"
                  >
                    {result.image && (
                      <Avatar className="h-8 w-8">
                        <img src={result.image} alt={result.label} />
                      </Avatar>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{result.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {result.subtitle}
                      </p>
                    </div>
                    <Badge className={getTypeColor(result.type)}>
                      {result.type}
                    </Badge>
                  </button>
                ))}
              </div>
            )}

          {/* Full Search Results */}
          {!isLoading &&
            searchResults?.data &&
            searchResults.data.length > 0 &&
            searchTerm.length >= 2 && (
              <div className="p-2">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground px-2 py-1">
                  All Results ({searchResults.pagination.total})
                </h4>
                {searchResults.data.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left px-4 py-3 hover:bg-muted transition-colors"
                  >
                    <div className="flex gap-3">
                      {result.image && (
                        <img
                          src={result.image}
                          alt={result.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">
                          {result.title}
                        </p>

                        <div
                          className="text-sm text-muted-foreground line-clamp-1"
                          dangerouslySetInnerHTML={{
                            __html: result.description || "",
                          }}
                        />
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getTypeColor(result.type)}>
                            {result.type}
                          </Badge>
                          {result.date && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(result.date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

          {/* No Results */}
          {!isLoading &&
            searchTerm.length >= 2 &&
            searchResults?.data?.length === 0 &&
            quickResults?.length === 0 && (
              <div className="text-center p-8 text-muted-foreground">
                No results found for "{searchTerm}"
              </div>
            )}
        </Card>
      )}
    </div>
  );
}

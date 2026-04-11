// hooks/useRecentSearches.ts
import { useDispatch,   } from "react-redux";
 
import {
    addRecentSearch,
    removeRecentSearch,
    clearAllRecentSearches,
    updateMaxItems,
} from "@/store/slices/recentSearch.slice";
import { useAuth } from "@/store/hooks/useAuth";
import { useAppSelector } from "@/store/hooks/store";
import { useSyncRecentSearchesMutation } from "@/services/recent-search.endpoints";
 

export interface RecentSearchInput {
    query: string;
    type?: string;
    url?: string;
}

export function useRecentSearches() {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [syncSearches] = useSyncRecentSearchesMutation();

    const recentSearches = useAppSelector((state) => state.recentSearches.searches);
    const maxItems = useAppSelector((state) => state.recentSearches.maxItems);

    const addSearch = (search: RecentSearchInput) => {
        dispatch(addRecentSearch(search));

        // Optional: Sync to backend if user is logged in
        if (user?._id) {
            syncSearches([...recentSearches, {
                id: `${Date.now()}-${search.query}`,
                ...search,
                timestamp: Date.now(),
            }]);
        }
    };

    const removeSearch = (id: string) => {
        dispatch(removeRecentSearch(id));
    };

    const clearAll = () => {
        dispatch(clearAllRecentSearches());
    };

    const setMaxItems = (max: number) => {
        dispatch(updateMaxItems(max));
    };

    return {
        recentSearches,
        maxItems,
        addSearch,
        removeSearch,
        clearAll,
        setMaxItems,
    };
}
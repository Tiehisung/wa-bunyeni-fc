"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

const useGetParam = (queryKey: string): string => {
    const searchParams = useSearchParams();
    
    return useMemo(() => {
        return searchParams?.get(queryKey) ?? '';
    }, [searchParams, queryKey]);
};

export default useGetParam;

// Hook to update search params
export function useUpdateSearchParams() {
  const router = useRouter();
  const pathname = usePathname();

  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(window.location.search);

    if (value && value.length > 0) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const search = params.toString();
    router.replace(`${pathname}${search ? `?${search}` : ""}`, {});
  };

  const clearParams = (param?: string) => {
    if (param) {
      // Remove one param
      setParam(param, "");
      return;
    }

    // Clear all params
    router.replace(pathname);
    // Note: There's no direct equivalent to router.refresh() in React Router
    // You might need to implement a custom solution or reload the page if needed
  };

  return { setParam, clearParams };
}

// Hook to clear params
export function useClearParams() {
  const router = useRouter();
  const pathname = usePathname();

  const clearAll = () => {
    router.replace(pathname);
  };

  const clearOnly = (...keys: string[]) => {
    const params = new URLSearchParams(window.location.search);
    keys.forEach((k) => params.delete(k));

    const search = params.toString();
    router.replace(`${pathname}${search ? `?${search}` : ""}`, {});
  };

  return { clearAll, clearOnly };
}

"use client";

import { usePathname, useRouter } from "next/navigation";

/**
 * Adds a searchparams and returns new pathname containing the searchParams with it's value
 * Use router to replace the new pathname
 * @param {*} key SearchParam to add
 * @param {*} value SearchParam value
 * @returns new pathname
 */
export const getNewPathname = (key: string, value: string) => {
  if (typeof window != "undefined") {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(key, value);

    const newPathname = `${
      window.location.pathname
    }?${searchParams.toString()}`;
    return newPathname;
  }
};

/**
 * Deletes a searchparams and returns new pathname without the searchParams.
 * Use router to replace the new pathname
 * @param {*} key SearchParam to delete
 * @returns new pathname
 */
export const deleteSearchParams = (key: string) => {
  if (typeof window === "undefined") return "";

  const searchParams = new URLSearchParams(window.location.search);
  searchParams.delete(key);
  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;
  return newPathname;
};

/**
 * Function to set/update query params.
 * @param key The query key
 * @param value Query value
 
 */

// Create a custom hook instead of a standalone function
export const useSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();

  const setSearchParams = (key: string, value: string) => {
    const searchParams = new URLSearchParams(window.location.search);

    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }

    const newPathname = `${pathname}?${searchParams.toString()}`;
    router.replace(newPathname);
  };

  const getSearchParam = (key: string) => {
    return new URLSearchParams(window.location.search).get(key);
  };

  return { setSearchParams, getSearchParam };
};

// Usage in a component:
// const { setSearchParams, getSearchParam } = useSearchParams();
// setSearchParams('tab', '1');

export type AnyObject = { [key: string]: unknown };
export function removeEmptyKeys(obj: AnyObject): AnyObject {
  return Object.keys(obj).reduce((acc: AnyObject, key: string) => {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

/**
 * Builds a query string using the current URL search params by default.
 * Optionally, you can pass overrides or additional query params.
 *
 * @param searchParams Optional overrides or additional parameters
 * @returns string - formatted query string like `?key=value&foo=bar`
 */
export function buildQueryString(
  searchParams?: Record<string, string | string[] | undefined>,
) {
  const sp = useSearchParams();
  if (!searchParams) return sp.toString();

  // Filter out undefined or empty values
  const query = new URLSearchParams(
    Object.entries(searchParams).filter(([_, v]) => v !== undefined) as [
      string,
      string,
    ][],
  ).toString();

  return query;
}

type SearchParamsValue = string | number | boolean | null | undefined;
type SearchParamsObject = Record<
  string,
  SearchParamsValue | SearchParamsValue[]
>;

interface SearchParamsOptions {
  /** Parse numbers automatically */
  parseNumbers?: boolean;
  /** Parse booleans (true/false) automatically */
  parseBooleans?: boolean;
  /** Remove empty values */
  removeEmpty?: boolean;
  /** Array keys suffix (e.g., 'ids[]' -> 'ids') */
  arraySuffix?: string;
}

/**
 * Convert URLSearchParams to a typed object
 */
export const sParamsToObject = (
  searchParams?: URLSearchParams | string,
  options: SearchParamsOptions = {},
): SearchParamsObject => {
  const {
    parseNumbers = true,
    parseBooleans = true,
    removeEmpty = true,
    arraySuffix = "[]",
  } = options;

  let params: URLSearchParams;
  if (searchParams instanceof URLSearchParams) {
    params = searchParams;
  } else if (typeof searchParams === "string") {
    params = new URLSearchParams(searchParams);
  } else {
    params = new URLSearchParams(window.location.search);
  }

  const result: SearchParamsObject = {};

  for (const [key, value] of params.entries()) {
    // Skip empty values if configured
    if (removeEmpty && !value) continue;

    // Clean key (remove array suffix)
    let cleanKey = key;
    if (arraySuffix && key.endsWith(arraySuffix)) {
      cleanKey = key.slice(0, -arraySuffix.length);
    }

    // Parse value
    let parsedValue: SearchParamsValue = value;
    if (parseNumbers && !isNaN(Number(value)) && value.trim() !== "") {
      parsedValue = Number(value);
    } else if (parseBooleans && value === "true") {
      parsedValue = true;
    } else if (parseBooleans && value === "false") {
      parsedValue = false;
    }

    // Handle multiple values
    if (result.hasOwnProperty(cleanKey)) {
      const existing = result[cleanKey];
      if (Array.isArray(existing)) {
        (existing as SearchParamsValue[]).push(parsedValue);
      } else {
        result[cleanKey] = [existing, parsedValue];
      }
    } else {
      result[cleanKey] = parsedValue;
    }
  }

  return result;
};


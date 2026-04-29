import { ISelectOptionLV } from "@/types";

// Convert string array to ISelectOption array
export function stringArrayToOptions(items: string[]): ISelectOptionLV[] {
  return items.map((item) => ({
    label: item,
    value: item.toLowerCase().replace(/\s+/g, "_"),
  }));
}

// Convert object array to ISelectOption array
export function objectArrayToOptions<T extends Record<string, any>>(
  items: T[],
  labelKey: keyof T,
  valueKey: keyof T
): ISelectOptionLV[] {
  return items.map((item) => ({
    label: String(item[labelKey]),
    value: String(item[valueKey]),
  }));
}

// Generate year options
export function generateYearOptions(
  startYear = 2020,
  endYear: number = new Date().getFullYear() + 5
): ISelectOptionLV[] {
  const years: ISelectOptionLV[] = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push({
      label: year.toString(),
      value: year.toString(),
    });
  }
  return years;
}

export function enumToOptions<E extends Record<string, string | number>>(enm: E) {
  function formatLabel(key: string) {
    // Convert ENUM_KEY or enumKey to "Enum Key"
    return key
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  
  return Object.keys(enm)
    .filter((key) => isNaN(Number(key))) // ignore reverse mappings for numeric enums
    .map((key) => ({
      label: formatLabel(key),
      value: enm[key] as string,
    }));
}


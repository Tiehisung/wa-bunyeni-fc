"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/buttons/Button";
import { Input } from "@/components/input/Inputs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface StaffFiltersProps {
  filters: {
    role: string;
    isActive: string;
    dateRange: { from: string; to: string };
  };
  onFilterChange: (key: string, value: any) => void;
}

const roles = [
  "Head Coach",
  "Assistant Coach",
  "Goalkeeper Coach",
  "Fitness Coach",
  "Physiotherapist",
  "Team Manager",
  "Kit Manager",
  "Nutritionist",
  "Doctor",
  "Scout",
];

export function StaffFilters({ filters, onFilterChange }: StaffFiltersProps) {
  const [open, setOpen] = useState(false);

  const hasActiveFilters =
    filters.role ||
    filters.isActive ||
    filters.dateRange.from ||
    filters.dateRange.to;

  const clearFilters = () => {
    onFilterChange("role", "");
    onFilterChange("isActive", "");
    onFilterChange("dateRange", { from: "", to: "" });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
              •
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filters</h4>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2 text-xs"
              >
                <X className="mr-1 h-3 w-3" /> Clear all
              </Button>
            )}
          </div>

          {/* Role Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Select
              value={filters.role}
              onValueChange={(value) => onFilterChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={filters.isActive}
              onValueChange={(value) => onFilterChange("isActive", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Signed</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="From"
                value={filters.dateRange.from}
                onChange={(e) =>
                  onFilterChange("dateRange", {
                    ...filters.dateRange,
                    from: e.target.value,
                  })
                }
                name={""}
              />
              <Input
                type="date"
                placeholder="To"
                value={filters.dateRange.to}
                onChange={(e) =>
                  onFilterChange("dateRange", {
                    ...filters.dateRange,
                    to: e.target.value,
                  })
                }
                name={""}
              />
            </div>
          </div>

          <Button className="w-full" onClick={() => setOpen(false)}>
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

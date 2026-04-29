"use client";

import { useState } from "react";
 
import { Plus, Search, Download, RefreshCw } from "lucide-react";
import { useGetStaffMembersQuery } from "@/services/staff.endpoints";
import { Button } from "@/components/buttons/Button";
import { Input } from "@/components/input/Inputs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Loader from "@/components/loaders/Loader";
import { Pagination } from "@/components/pagination/Pagination";
import { StaffTable } from "./StaffTable";
import { StaffStats } from "./StaffStats";
import { StaffFilters } from "./StaffFilters";
import { exportAsJson } from "@/lib/export/json";
import AdminStaffCard from "./Card";
import { useAppSelector } from "@/store/hooks/store";
import DisplayType from "@/components/DisplayType";
import { useRouter, useSearchParams } from "next/navigation";

export default function AllStaffPage() {
  const router = useRouter();
  const { displayType } = useAppSelector((s) => s.settings);
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    role: "",
    isActive: "",
    dateRange: { from: "", to: "" },
  });

  const  sp  = useSearchParams();

  const { data, isLoading, isFetching, error, refetch } =
    useGetStaffMembersQuery(sp.toString());

  const staff = data?.data || [];
  const pagination = data?.pagination;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    // setPage(1);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    // setPage(1);
  };

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load staff members. Please try again.
          </AlertDescription>
          <Button onClick={() => refetch()} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage your coaching and support staff
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportAsJson(staff, "our-staff-export")}
            // disabled={staff?.length === 0}
          >
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>

          <Button
            onClick={() => {
              router.push("/admin/staff/new");
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Staff
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StaffStats data={staff} />

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search staff by name, email, role..."
              value={search}
              onChange={handleSearch}
              className="pl-10"
              name={""}
            />
          </div>

          <StaffFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>

        <div className="flex items-center gap-4">
          <DisplayType />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <Loader message="Loading staff members..." />
        </div>
      ) : staff.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">No staff members found</h3>
            <p className="text-muted-foreground">
              {search || filters.role || filters.isActive
                ? "Try adjusting your search or filters"
                : "Get started by adding your first staff member"}
            </p>
            {(search || filters.role || filters.isActive) && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setFilters({
                    role: "",
                    isActive: "",
                    dateRange: { from: "", to: "" },
                  });
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
      ) : displayType === "list" ? (
        <StaffTable data={staff} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {staff?.map((stf) => (
            <AdminStaffCard key={stf?._id} staff={stf} viewStyle="grid" />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-6">
          <Pagination pagination={pagination} />
        </div>
      )}
    </div>
  );
}

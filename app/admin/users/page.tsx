"use client";

import { Users, Shield, Download } from "lucide-react";
import UserTable from "./UserTable";
import HEADER from "@/components/Element";
import { DIALOG } from "@/components/Dialog";
import UserForm from "./UserForm";
 
import { useGetUsersQuery } from "@/services/user.endpoints";
import Loader from "@/components/loaders/Loader";
 
import { useSearchParams } from "next/navigation";
import DataErrorAlert from "@/components/error/DataError";

export default function UsersPage() {
  const  searchParams  = useSearchParams();
  const paramsString = searchParams.toString();

  const {
    data: users,
    isLoading,
    error,
    isFetching,
  } = useGetUsersQuery(paramsString);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <HEADER
          title={
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="w-8 h-8 text-primary-600" />
              User Management Dashboard
            </h1>
          }
          subtitle="View and manage users authenticated via Google or Credentials"
          className="flex flex-wrap items-center justify-between gap-6 text-Orange"
        >
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
            <Download className="w-5 h-5" />
            Export Users
          </button>
        </HEADER>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center min-h-100">
          <Loader message="Loading users..." />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <HEADER
          title={
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="w-8 h-8 text-primary-600" />
              User Management Dashboard
            </h1>
          }
          subtitle="View and manage users authenticated via Google or Credentials"
          className="flex flex-wrap items-center justify-between gap-6 text-Orange"
        >
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
            <Download className="w-5 h-5" />
            Export Users
          </button>
        </HEADER>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DataErrorAlert message={error} />
        </main>
      </div> 
    );
  }

  return (
    <div className="min-h-screen">
      <HEADER
        title={
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8 text-primary-600" />
            User Management Dashboard
          </h1>
        }
        subtitle="View and manage users authenticated via Google or Credentials"
        className="flex flex-wrap items-center justify-between gap-6 text-Orange"
      >
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
          <Download className="w-5 h-5" />
          Export Users
        </button>
      </HEADER>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-semibold">User Overview</h2>
            </div>
            <p className="text-muted-foreground">
              All users who have logged in using Google OAuth or traditional
              credentials
            </p>
          </div>

          <DIALOG
            trigger={"Add New User"}
            title="Add New User"
            variant={"default"}
          >
            <UserForm />
          </DIALOG>
        </section>

        <UserTable users={users} />

        {isFetching && (
          <div className="fixed bottom-4 right-4">
            <Loader size="sm" message="Updating..." />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t">
          <div className="text-center text-gray-500 text-sm">
            <p>User Management Dashboard • {new Date().getFullYear()}</p>
            <p className="mt-1">
              Showing users authenticated via Google or Credentials
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

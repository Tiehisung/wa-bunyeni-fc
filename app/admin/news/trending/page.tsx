// app/admin/trending/page.tsx
"use client";

import { TrendingNewsUpdateCard } from "./TrendingCard";

export default function TrendingAdminPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trending Management</h1>
        <p className="text-sm text-muted-foreground">
          Manual overrides and controls
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TrendingNewsUpdateCard />
     
      </div>

    
    </div>
  );
}

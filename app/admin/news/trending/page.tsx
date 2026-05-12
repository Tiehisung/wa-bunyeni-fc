// app/admin/trending/page.tsx
"use client";

import { TrendingNewsUpdateCard } from "./TrendingCard";

export default function TrendNews() {
  return (
    <div className="container mx-auto py-8 space-y-6" id='trends'>
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <h1 className="text-2xl font-bold">Trending Management</h1>
        <p className="text-sm text-muted-foreground">
          Manual overrides and controls
        </p>
      </div>

      <div className="grid ">
        <TrendingNewsUpdateCard />
     
      </div>

    
    </div>
  );
}

// components/admin/AdminTrendingMenu.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TrendingUp, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function AdminTrendingNewsMenu() {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateTrending = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch("/api/news/trending", {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Failed to update trending");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <TrendingUp className="h-4 w-4 mr-2" />
          Trending
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Trending Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleUpdateTrending} disabled={isUpdating}>
          {isUpdating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          {isUpdating ? "Updating..." : "Recalculate Scores"}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/news/trending">View Statistics</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

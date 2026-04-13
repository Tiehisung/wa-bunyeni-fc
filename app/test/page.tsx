// app/test/page.tsx
"use client";

import { useGetPlayersQuery } from "@/services/player.endpoints";
import { useEffect } from "react";

export default function TestPage() {
  const { data, isLoading, error, isError, status } = useGetPlayersQuery('');

  console.log(data)

  useEffect(() => {
    console.log("🔍 RTK Query Debug:");
    console.log("  - isLoading:", isLoading);
    console.log("  - isError:", isError);
    console.log("  - error:", error);
    console.log("  - status:", status);
    console.log("  - data:", data);
  }, [data, isLoading, error, isError, status]);

  if (isLoading) return <div>Loading... (check console for debug)</div>;
  if (isError) return <div>Error: {JSON.stringify(error)}</div>;
  if (!data) return <div>No data received</div>;

  return (
    <div>
      <h1>Players Loaded: {data.data?.length || 0}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

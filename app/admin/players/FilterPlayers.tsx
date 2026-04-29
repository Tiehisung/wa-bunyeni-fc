"use client";

import { PrimarySelect } from "@/components/select/Select";
import { useUpdateSearchParams } from "@/hooks/params";

export default function FilterPlayers({}) {
  const { setParam } = useUpdateSearchParams();

  const handleOnChangeFilter = (value: string) => {
    setParam("card", value.toLowerCase());
  };
  return (
    <PrimarySelect
      options={[
        { label: "🟨Yellow carded", value: "yellow" },
        { label: "🟥Red carded", value: "red" },
      ]}
      placeholder="Card Filters"
      onChange={handleOnChangeFilter}
      triggerStyles="border bg-card "
    />
  );
}

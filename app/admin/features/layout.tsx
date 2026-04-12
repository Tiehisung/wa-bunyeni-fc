import { LinkTabs } from "@/components/Tabs";
 
import { FC, ReactNode } from "react";

 
const FeaturesLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const tabs = [
    { label: "Teams", path: "/admin/features/teams" },
    { label: "Goals", path: "/admin/features/goals" },
  ];
  return (
    <div>
      <h1 className="_title font-semibold mb-4 p-2">Features</h1>
      <LinkTabs tabs={tabs} wrapperStyles="border-b" />

      <main>{children}</main>
    </div>
  );
};

export default FeaturesLayout;

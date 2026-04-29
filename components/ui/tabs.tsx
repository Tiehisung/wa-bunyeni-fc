"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-0.75",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };

export interface TabConfig {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface ReusableTabsProps {
  tabs: TabConfig[];
  children: React.ReactNode[];
  defaultValue?: string;
  className?: string;
  listClassName?: string;
  contentClassName?: string;
triggerClassName?: string;
  hideLabelOnMobile?: boolean;
}

export function TABS({
  tabs,
  defaultValue,
  className = "w-full",
  listClassName = "",
  contentClassName = "space-y-4",
  children,
  hideLabelOnMobile,triggerClassName=''
}: ReusableTabsProps) {
  const defaultTab = defaultValue || tabs[0]?.value;

  // const resolvedTabs=tabs?.map(t=>({...t,value:t?.value??t?.label}))//Value is optional

  return (
    <Tabs defaultValue={defaultTab} className={className}>
      <TabsList className={cn(`flex px-3 border-b pb-0 bg-background`, listClassName)}>
        {tabs?.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn("flex items-center gap-2", triggerClassName)}
          >
            {tab?.icon ?? ""}
            {hideLabelOnMobile ? (
              <span className="hidden sm:inline">{tab.label}</span>
            ) : (
              <span className="inline">{tab.label}</span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      {children?.map((cont, i) => (
        <TabsContent
          key={i}
          value={tabs?.[i]?.value}
          className={cn('p-4', contentClassName)}
        >
          {cont}
        </TabsContent>
      ))}
    </Tabs>
  );
}

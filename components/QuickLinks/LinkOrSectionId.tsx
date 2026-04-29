 'use client'
 
import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
 
interface QuickLink {
  title: string;
  href?: string; // Can be "/page" or "#sectionId"
  description?: string;
  sectionId?: string;
}

interface QuickLinksProps {
  links: QuickLink[];
  className?: string;
}

export const QuickLinks: FC<QuickLinksProps> = ({ links, className = "" }) => {
  const handleClick = (id: string) => {
    if (id) {
      // Scroll to section on the page
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
    >
      {links.map((link) => {
        if (link.href)
          return (
            <Link href={link.href} key={link.href}>
              <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer relative">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {link?.title}
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                {link?.description && (
                  <CardContent className="text-sm text-muted-foreground line-clamp-1">
                    {link?.description}
                  </CardContent>
                )}
              </Card>
            </Link>
          );
        return (
          <Card
            key={link?.sectionId}
            className="hover:shadow-lg transition-shadow duration-200 cursor-pointer relative"
            onClick={() => handleClick(link?.sectionId as string)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {link?.title}
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            {link?.description && (
              <CardContent className="text-sm text-muted-foreground line-clamp-1">
                {link?.description}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};

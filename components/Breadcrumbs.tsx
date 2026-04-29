"use client";

import { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import { shortText } from "@/lib";
import { pathnameToLinks } from "@/lib/dom";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Breadcrumbs = ({
  _links,
  className = "z-1 relative max-sm:hidden",
}: {
  _links?: Array<{ path: string; text: string }>;
  className?: string;
}) => {
  const pathname = usePathname();
  const genlinks = pathnameToLinks(pathname);
  const [links, setLinks] = useState(_links ?? genlinks);

  useEffect(() => {
    setLinks(_links ?? genlinks);
  }, [pathname, _links]);

  return (
    <ul className={`flex items-center capitalize text-sm p-4 ${className}`}>
      {links.map((linkOb, i) => (
        <li key={i} className="flex items-center ">
          {i > 0 && <FaAngleRight className="mx-1.5 text-muted-foreground" />}
          {i == links.length - 1 ? (
            shortText(decodeURIComponent(linkOb.text))
          ) : (
            <Link
              href={linkOb.path}
              className={`${"opacity-55"} ${
                pathname == linkOb.path ? "text-muted-foreground" : ""
              } `}
            >
              {shortText(decodeURIComponent(linkOb.text))}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Breadcrumbs;

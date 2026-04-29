"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { IconType } from "react-icons/lib";
import { fireEscape } from "../../hooks/Esc";
import { HoverDropdown } from "../Dropdown";

import { useGetViewportWidth } from "@/hooks/windowXY";
import { useOverflow } from "@/hooks/overflow";
import { icons } from "@/assets/icons/icons";
import Link from "next/link";
 

export interface IResizableLinksProps {
  wrapperStyles?: string;
  linkStyles?: string;
  dropdownLinkStyles?: string;
  dropdownWrapperStyles?: string;
  trigger?: ReactNode;
  links: {
    label: string;
    path?: string;
    icon?: ReactNode;
  }[];
  correctiveSpace?: 200 | 180 | 150 | 140 | 120 | 100 | 40;
}
export const ResizableLinks = ({
  links = exampleLinks,
  linkStyles,
  wrapperStyles,
  correctiveSpace = 140,
}: IResizableLinksProps) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const screenWidth = useGetViewportWidth();
  const [count, setCount] = useState(
    screenWidth <= 640
      ? 3
      : screenWidth <= 768
        ? 4
        : screenWidth <= 1024
          ? 6
          : 8,
  );

  const isOverflowing = useOverflow(outerRef, "horizontal");

  useEffect(() => {
    const outerWidth = outerRef.current?.offsetWidth;
    const innerWidth = innerRef.current?.offsetWidth;

    const compute = () => {
      if (!outerWidth || !innerWidth) return;

      if (outerWidth > innerWidth + correctiveSpace) {
        const n = links.length > count ? count + 1 : count;

        setCount(n);
      } else if (innerWidth + 60 >= outerWidth) {
        const n = count > 1 ? count - 1 : count;
        setCount(n);
      }
    };
    compute();

    window.addEventListener("resize", compute);

    return () => {
      window.removeEventListener("resize", compute);
    };
  }, [isOverflowing, screenWidth]);
  const isActive = (path: string) =>
    path == window.location.pathname || path == window.location.pathname + "/";

  return (
    <div ref={outerRef} className="grow w-full max-w-[85vw]">
      <div
        ref={innerRef}
        className={`flex items-center gap-2 w-fit  ${wrapperStyles}`}
      >
        {links?.slice(0, count).map(({ label, path, icon }, i) => {
          return (
            <Link
              key={i}
              href={path ?? ""}
              className={`flex items-center gap-2 line-clamp-1 hover:bg-border/50 hover:text-primary slowTrans rounded p-2 whitespace-nowrap ${
                isActive(path ?? "") ? "text-primary" : ""
              } ${linkStyles}`}
            >
              {icon && <span className="flex items-center">{icon}</span>}{" "}
              {label}
            </Link>
          );
        })}

        <HiddenDropdownLinks links={links.slice(count)} />
      </div>
    </div>
  );
};

const HiddenDropdownLinks = ({
  links,
  dropdownLinkStyles,
  dropdownWrapperStyles,
}: IResizableLinksProps) => {
  const screenWidth = useGetViewportWidth();
  const isActive = (path: string) =>
    path == window.location.pathname || path == window.location.pathname + "/";

  return (
    <div>
      {links.length > 0 && (
        <HoverDropdown
          id="test-hover-drop"
          className={`absolute top-full max-h-[75vh] overflow-y-auto grid bg-white border p-2 rounded space-y-1 ${
            screenWidth <= 640 ? "right-0" : ""
          } ${dropdownWrapperStyles}`}
        >
          {links.map(({ label, path, icon }, i) => (
            <Link
              href={path ?? ""}
              key={i}
              className={`flex items-center gap-2 _menuitem hover:bg-border/50 hover:text-primary slowTrans rounded p-2 whitespace-nowrap ${
                isActive(path ?? "") ? "text-primary" : ""
              } ${dropdownLinkStyles}`}
              onClick={() => fireEscape()}
            >
              {icon && <span className="flex items-center">{icon}</span>}{" "}
              {label}
            </Link>
          ))}
        </HoverDropdown>
      )}
    </div>
  );
};

const exampleLinks: IResizableLinksProps["links"] = Object.values(icons).map(
  (icon, i) => {
    const Icon = icon as IconType;
    return {
      label: Object.keys(icons)[i],
      path: "",
      leading: { icon: <Icon /> },
    };
  },
);

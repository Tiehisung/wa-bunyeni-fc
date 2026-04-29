 "use client";

 
import { scrollToElement } from "@/lib/dom";
import { ReactNode, useState } from "react";

/**
 *
 * @param {} sections Array of section objects containing 'name' and 'sectionId'.
 * @param scroll boolean to toggle scroll behavior
 * @param className Adds some extra styles to section
 * @param containerStyles styles adds CSS classes to sections container
 * @returns
 */

type Section = {
  name: string;
  sectionId: string;
};
type QLinksProps = {
  sections: Section[];
  className?: string;
  containerStyles?: string;
  title?: ReactNode;
};

export default function QuickPageLinks({
  sections,
  className = "px-2 w-20 truncate rounded-full secondary__btn",
  containerStyles = "flex gap-3 p-1 items-center w-full overflow-x-auto ",
  title = "Also in this page",
}: QLinksProps) {
  const [reordered, setReordered] = useState(sections);

  const handleReorder = (curSection: Section) => {
    scrollToElement(curSection.sectionId);
    setReordered((prevSections) => [
      ...prevSections.filter(
        (section) => section.sectionId !== curSection.sectionId
      ),
      curSection,
    ]);
  };
  return (
    <div>
      {title && <div className="text-xs ">{title}</div>}

      <ul className={`_hideScrollbar ${containerStyles}`}>
        {reordered.map((section, index) => (
          <li
            key={index}
            onClick={() => handleReorder(section)}
            className={` text-blue-500 text-xs cursor-pointer ${className}`}
          >
            {section.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

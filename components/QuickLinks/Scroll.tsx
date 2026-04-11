 "use client";


import { scrollToElement } from "@/lib/dom";
/**ScrollToSectionDropdown displays sections as dropdown
 * This component allows user to navigate to any specific section providing matching section id such as class name.
 * @param {*} sectionsList List of sections to be displayed for click.
 * @param sectionsList Structure { name : string, id: string }[ ]
 * @returns
 */

import { CgScrollV } from "react-icons/cg";

export function ScrollToDropdown({
  sectionsList = [],
  label = "Go to section",
}: {
  sectionsList: {
    name: string;
    id: string;
  }[];
  label: string;
}) {
  return (
    <div
      className={`sticky top-1 left-[90%] z-20 group w-10 hover:w-50 transition-all duration-300 ${
        sectionsList?.length < 2 ? "hidden" : ""
      }`}
    >
      <button
        className="_secondaryBtn p-2 text-xs flex items-center w-9 group-hover:w-full gap-3 ml-auto"
        title="Go to section"
        type="button"
      >
        <CgScrollV />
        <span className="max-md:hidden hidden group-hover:flex">{label} </span>
      </button>
      {/* Classes */}
      <div className="absolute bg-yellow-50 w-full max-h-[30vh] h-0 overflow-y-auto group-hover:h-fit shadow">
        {sectionsList.length > 0 &&
          sectionsList.map((section, index) => (
            <button
              type="button"
              key={index}
              onClick={() => scrollToElement(section.id)}
              className="_secondaryBtn px-1 truncate w-full max-w-50 text-xs text-left"
            >
              {section.name}
            </button>
          ))}
      </div>
    </div>
  );
}

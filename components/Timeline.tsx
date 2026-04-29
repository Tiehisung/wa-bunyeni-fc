import   { ReactNode } from "react";
import { FaBriefcase } from "react-icons/fa6";

/**
 * Timeline flowbite
 * @param icons Array of preffered list icons equal in length to the number of children so rendered
 * @param children Components to render as children
 * @returns
 */
export const TimelineFlowbite = ({
  children,
  icons,
  className,
}: {
  children: Array<ReactNode>;
  icons?: Array<ReactNode>;
  className?: string;
}) => {
  return (
    <ol className={`relative ${className}`}>
      {children.map((lineItem, i) => (
        <li className="mb-10 ms-6 flex gap-2 items-start" key={i}>
          <span className=" flex items-center justify-center w-6 h-6 rounded-full -inset-s-3 ring-8 ring-secondary bg-popover text-secondary-foreground ">
            {icons?.[i] ?? <FaBriefcase />}
          </span>
          {lineItem}
        </li>
      ))}
    </ol>
  );
};

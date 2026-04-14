import { generateNumbers } from "@/lib";
import { cn } from "@/lib/utils";

const sizes = {
  xs: "h-2",
  sm: "h-4",
  md: "h-8",
  lg: "h-16",
  xl: "h-32",
  "2xl": "h-40",
};

const TableLoader = ({
  rows = 1,
  cols = 2,
  className,
  wrapperClassName,
  size = "md",
}: {
  rows?: number;
  cols?: number;
  className?: string;
  wrapperClassName?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}) => {
  const rowsCount = generateNumbers(1, rows);
  const colsCount = generateNumbers(1, cols);
  return (
    <div
      className={cn(
        `flex justify-center items-center grow w-full `,
        wrapperClassName,
      )}
    >
      <table className={`mx-auto w-full `}>
        <tbody>
          <tr>
            {colsCount.map((_, cIndex) => (
              <th key={cIndex}>
                <div
                  className={cn(
                    `my-2 mx-auto w-[95%] h-4 bg-accent rounded animate-pulse border `,
                    sizes[size],
                    className,
                  )}
                />
              </th>
            ))}
          </tr>

          {rowsCount.map((_, index) => (
            <tr key={index}>
              {colsCount.map((_, cIndex) => (
                <td key={cIndex}>
                  <div
                    className={cn(
                      `my-2 mx-auto w-[95%] h-4 bg-accent/90 rounded animate-pulse border `,
                      sizes[size],
                      className,
                    )}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableLoader;

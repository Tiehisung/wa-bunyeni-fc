 

import { ReactNode } from "react";
import { ITableData } from "./SmartTable";

/**
 * @param {*} importTable Data variable that holds imported data to this table.
 * @returns
 */

export default function OutPutTable({
  importTable = {
    headers: [],
    body: [],
  },
  showNumbering = true,
}: {
  importTable: ITableData;
  showNumbering: boolean;
}) {
  return (
    <div className="max-w-full grid justify-start items-center p-2">
      <div
        className={`w-full overflow-auto ${
          importTable?.headers?.length > 0 ? "grid" : "hidden"
        }`}
      >
        <table className=" w-full ">
          <tbody>
            <tr className=" bg-slate-100">
              <th className="p-1 py-2 border" hidden={!showNumbering}>
                #
              </th>
              {importTable?.headers?.map((colName, colIndex) => (
                <th key={colIndex} className="border hover:ring-[1px] p-2">
                  {colName}
                </th>
              ))}
            </tr>
            {importTable?.body?.map((rowData, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${rowIndex % 2 === 0 ? "" : "bg-slate-200"}`}
              >
                <td
                  hidden={!showNumbering}
                  className="border bg-gray-50  group text-xs min-w-10 p-1"
                >
                  {rowIndex + 1}
                </td>
                {rowData.map(
                  (
                    colValue: string | number | bigint | boolean,
                    colIndex: number
                  ) => (
                    <td
                      key={colIndex}
                      className={`border outline-[1px] hover:outline hover:bg-slate-50 p-2 pr-3 ${
                        isNumber(colValue) && " text-green-700"
                      }`}
                    >
                      {colValue}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function isNumber(data:ReactNode) {
  if (typeof data !== "string") return false;
  return data.split("").every((char) => "-+0987654321".includes(char));
}

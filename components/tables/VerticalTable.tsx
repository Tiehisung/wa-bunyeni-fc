import { ISelectOptionLV } from "@/types";

interface IProps {
  trStyles?: string;
  labelTDStyles?: string;
  valueTDStyles?: string;
  body: ISelectOptionLV[];
  className?:string
}

export function LVOutPutTable({
  body = [{ label: "key", value: "value" }],
  ...props
}: IProps) {
  return (
    <table className={`text-sm ${body?.length > 0 ? "flex" : "hidden"} ${props.className}`}>
      <tbody className="w-full ">
        {body?.map((rowObject, rowIndex) => (
          <tr key={rowIndex} className={`${props.trStyles} `}>
            <td
              className={`border group text-xs min-w-10 p-1 text-right font-semibold ${props.labelTDStyles}`}
            >
              {rowObject.label}
            </td>
            <td
              className={`border p-2 pr-3 grow ${
                rowObject.value
                  ?.split("")
                  ?.every((char) => "-+0987654321".includes(char)) &&
                " text-green-700"
              } ${props.valueTDStyles}`}
            >
              {rowObject.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

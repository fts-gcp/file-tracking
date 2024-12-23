import { ReactNode } from "react";
import SearchInput from "@/components/SearchInput";

interface Props {
  headers: string[] | ReactNode[];
  data: { rows: { cols: ReactNode[] | string[] }[] };
  isSearchable?: boolean;
  searchValue?: string;
}

const CustomTable = ({ headers, data, isSearchable, searchValue }: Props) => {
  if (data.rows.length === 0) {
    return (
      <div className={"text-center text-azureBlue font-bold text-lg"}>
        No data available
      </div>
    );
  }
  return (
    <div>
      {isSearchable && <SearchInput value={searchValue || ""} />}
      <table className={"border-separate border-white"}>
        <thead>
          <tr className={"text-start"}>
            {headers.map((header, index) => (
              <th
                key={index}
                className={
                  "bg-azureBlue opacity-60 text-white p-2 px-4 rounded-lg"
                }
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, index) => (
            <tr
              key={index}
              className={"text-start border-2"}
              style={{
                backgroundColor: index % 2 === 0 ? "#d4d4d4" : "#F6F7F7",
              }}
            >
              {row.cols.map((col, index) => (
                <td key={index} className={"p-2 px-4 rounded-lg"}>
                  {col}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;

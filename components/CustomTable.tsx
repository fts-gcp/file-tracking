interface Props {
  headers: string[];
  data: string[][];
}

const CustomTable = ({ headers, data }: Props) => {
  if (data.length === 0) {
    return (
      <div className={"text-center text-azureBlue font-bold text-lg"}>
        No data available
      </div>
    );
  }
  return (
    <div>
      <table
        className={"border-separate border-spacing-x-4 border-spacing-y-2"}
      >
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
          {data.map((row, index) => (
            <tr className={"text-start"} key={index}>
              {row.map((col, index) => (
                <td key={index} className={""}>
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

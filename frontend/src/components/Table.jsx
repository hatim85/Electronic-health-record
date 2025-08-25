export default function Table({ headers, data }) {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full border-collapse">
        <thead className="bg-blue-600 text-white">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-2 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr
                key={idx}
                className="border-b hover:bg-gray-100 transition"
              >
                {headers.map((h) => (
                  <td key={h} className="px-4 py-2 text-gray-700">
                    {row[h] || "-"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="text-center py-4 text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

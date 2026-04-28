export function ReportsRowSkeleton() {
  return (
    <tr className="border-b border-gray-50 dark:border-gray-800">
      {[48, 28, 44, 32, 20].map((width, index) => (
        <td key={index} className="px-4 py-3.5">
          <div
            className="h-3.5 rounded bg-gray-100 dark:bg-gray-800 animate-pulse"
            style={{ width: width * 2 }}
          />
        </td>
      ))}
      <td className="px-4 py-3.5">
        <div className="flex justify-end gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
          <div className="w-20 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
          <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

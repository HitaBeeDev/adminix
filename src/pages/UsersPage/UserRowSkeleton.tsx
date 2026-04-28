export function UserRowSkeleton() {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800">
      <td className="pl-4 pr-2 py-3">
        <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </td>
      {[40, 56, 24, 20, 32].map((width, index) => (
        <td key={index} className="px-4 py-3">
          <div
            className="h-3.5 rounded bg-gray-100 dark:bg-gray-800 animate-pulse"
            style={{ width: `${width * 2}px` }}
          />
        </td>
      ))}
      <td className="px-4 py-3">
        <div className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </td>
    </tr>
  );
}

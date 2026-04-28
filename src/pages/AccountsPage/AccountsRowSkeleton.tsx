export function AccountsRowSkeleton() {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800">
      {[48, 32, 56, 20, 24, 36].map((width, index) => (
        <td key={index} className="px-4 py-3.5">
          <div
            className="h-3.5 rounded bg-gray-100 dark:bg-gray-800 animate-pulse"
            style={{ width: width * 2 }}
          />
        </td>
      ))}
      <td className="px-4 py-3.5">
        <div className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </td>
    </tr>
  );
}

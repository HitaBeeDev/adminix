import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-500">Page not found</p>
      <Link to="/dashboard" className="text-blue-500 hover:underline">
        Back to Dashboard
      </Link>
    </div>
  );
}

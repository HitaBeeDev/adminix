import { Link } from 'react-router';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-6">
      <p className="text-8xl font-black text-indigo-100 dark:text-indigo-950 select-none leading-none">
        404
      </p>
      <div className="-mt-4 text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Page not found</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <Link
        to="/dashboard"
        className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-[#4fc4cf] text-[#181818] hover:brightness-105 transition-colors"
      >
        <Home size={15} />
        Back to Dashboard
      </Link>
    </div>
  );
}

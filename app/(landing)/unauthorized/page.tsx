import Link from 'next/link';
import { FaLock, FaHome } from 'react-icons/fa';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div className="text-center">
          <FaLock className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Oops! You don't have permission to access this page.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <p className="text-center text-md text-gray-500">
            If you believe this is an error, please contact the administrator or try logging in again.
          </p>
          <div className="flex justify-center">
            <Link href="/" className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FaHome className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
              </span>
              Return to Home
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Maverick Sparks. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}


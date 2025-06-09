'use client';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
                <h1 className="text-6xl font-bold text-red-500 mb-2">404</h1>
                <div className="w-16 h-1 bg-red-500 mx-auto mb-6"></div>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Page Not Found
                </h2>

                <p className="text-gray-600 mb-8">
                    Could not find the requested resource.
                </p>

                <div className="flex flex-col space-y-4">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
                    >
                        Return to Homepage
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface ErrorDetails {
    code: string;
    title: string;
    description: string;
}

const ErrorPage = () => {
    const searchParams = useSearchParams();
    const [errorDetails, setErrorDetails] = useState<ErrorDetails>({
        code: '500',
        title: 'Server Error',
        description: 'An unexpected error occurred'
    });

    useEffect(() => {
        // Lấy thông tin lỗi từ query parameters
        const code = searchParams?.get('code') || '500';
        const message = searchParams?.get('message');

        // Xác định chi tiết lỗi dựa trên mã lỗi
        switch (code) {
            case '404':
                setErrorDetails({
                    code: '404',
                    title: 'Page Not Found',
                    description: message || 'The page you are looking for does not exist or has been moved.'
                });
                break;
            case '403':
                setErrorDetails({
                    code: '403',
                    title: 'Access Denied',
                    description: message || 'You do not have permission to access this resource.'
                });
                break;
            case '401':
                setErrorDetails({
                    code: '401',
                    title: 'Unauthorized',
                    description: message || 'Authentication is required to access this resource.'
                });
                break;
            default:
                setErrorDetails({
                    code: code,
                    title: 'Server Error',
                    description: message || 'Something went wrong on our servers. Please try again later.'
                });
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
                <h1 className="text-6xl font-bold text-red-500 mb-2">{errorDetails.code}</h1>
                <div className="w-16 h-1 bg-red-500 mx-auto mb-6">

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        {errorDetails.title}
                    </h2>

                    <p className="text-gray-600 mb-8">
                        {errorDetails.description}
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
        </div>
    );
};

export default ErrorPage;
import React from 'react';
import {BsChevronLeft, BsChevronRight} from 'react-icons/bs';
import clsx from 'clsx';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
                                                   currentPage,
                                                   totalPages,
                                                   onPageChange
                                               }) => {
    if (totalPages <= 1) return null;

    // Determine which page numbers to show
    const getPageNumbers = () => {
        const pages = [];

        // Always show first page
        pages.push(1);

        // Current page and surrounding pages
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
            if (!pages.includes(i)) {
                pages.push(i);
            }
        }

        // Always show last page if more than 1 page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        // Add ellipses where needed
        const result = [];
        let prevPage = null;

        for (const page of pages) {
            if (prevPage && page - prevPage > 1) {
                result.push('...');
            }
            result.push(page);
            prevPage = page;
        }

        return result;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center mt-6 gap-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={clsx(
                    "p-2 border rounded-md hover:bg-gray-100 transition-colors",
                    currentPage === 1 && "opacity-50 cursor-not-allowed"
                )}
                aria-label="Previous page"
            >
                <BsChevronLeft/>
            </button>

            {pageNumbers.map((page, index) => (
                page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2">...</span>
                ) : (
                    <button
                        key={`page-${page}`}
                        onClick={() => onPageChange(Number(page))}
                        className={clsx(
                            "w-9 h-9 rounded-md transition-all",
                            currentPage === page
                                ? 'bg-[#0053E2] text-white font-medium'
                                : 'border hover:bg-gray-100'
                        )}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                    >
                        {page}
                    </button>
                )
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={clsx(
                    "p-2 border rounded-md hover:bg-gray-100 transition-colors",
                    currentPage === totalPages && "opacity-50 cursor-not-allowed"
                )}
                aria-label="Next page"
            >
                <BsChevronRight/>
            </button>
        </div>
    );
};

export default Pagination;
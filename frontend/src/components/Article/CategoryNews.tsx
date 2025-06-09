import DOMPurify from "dompurify";
interface CategoryNewsProps {
  getAllArticles: any[];
  category: string;
}

export default function CategoryNews({
  getAllArticles,
  category,
}: CategoryNewsProps) {
  return (
    <main className="text-gray-800 py-6">
      {getAllArticles.length > 0 && (
        <div>
          <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-3 mb-4">
            <nav className="flex flex-wrap items-center space-x-4 text-sm sm:text-base">
              <a href="#" className="font-semibold text-blue-600">
                {category}
              </a>
            </nav>
            <a
              href={`/bai-viet/danh-muc/${encodeURIComponent(category)}`}
              className="text-blue-600 text-sm sm:text-base flex items-center space-x-1"
            >
              <span className="text-sm">Xem tất cả</span>
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </a>
          </div>

          {/* Main content */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
              <div className="flex flex-col flex-grow space-y-4 h-full">
                {getAllArticles.slice(0, 3).map((article: any, idx: any) => (
                  <article
                    key={idx}
                    className="bg-gray-100 rounded-md p-3 h-full"
                  >
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(article.title || ""),
                      }}
                    />
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(article.content || ""),
                        }}
                      />
                    </p>
                  </article>
                ))}
              </div>
            </div>

            {getAllArticles.length > 3 && (
              <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
                {getAllArticles.slice(3, 6).map((article: any, idx: any) => (
                  <article
                    key={idx}
                    className="flex-grow bg-white rounded-md p-3 border border-transparent hover:border-gray-200"
                  >
                    <span className="inline-block bg-gray-300 text-gray-700 text-xs rounded-full px-3 py-1 mb-1 select-none">
                      {article.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 text-base leading-snug">
                      {article.title}
                    </h3>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import { useArticle } from "@/hooks/useArticle";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import placeholderImage from "@/images/22.webp";
import DOMPurify from "dompurify";

export default function CategoryArticlesPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = params;
  const decodedCategory = decodeURIComponent(category);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getAllArticlesUser, fetchGetAllArticleUser } = useArticle();

  useEffect(() => {
    setLoading(true);
    fetchGetAllArticleUser(
      () => {
        const filteredArticles = getAllArticlesUser.filter(
          (article: any) => article.category === decodedCategory
        );
        setArticles(filteredArticles);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
  }, [decodedCategory, fetchGetAllArticleUser]);

  return (
    <div className="container mx-auto px-4 py-8 pt-[135px]">
      {/* Breadcrumb */}
      <div className="text-sm mb-6">
        <Link href="/" className="text-blue-600 hover:underline">
          Trang chủ
        </Link>
        <span className="text-gray-500"> / </span>
        <Link href="/bai-viet" className="text-blue-600 hover:underline">
          Góc sức khỏe
        </Link>
        <span className="text-gray-500"> / {decodedCategory}</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-6">{decodedCategory}</h1>

      {articles.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">
            Không có bài viết nào trong danh mục này
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: any, index) => (
            <Link key={index} href={`/bai-viet/${article.slug}`}>
              <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="aspect-video relative">
                  <Image
                    src={article.image_thumbnail || placeholderImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <div className="mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold">
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(article.title),
                      }}
                    />
                  </h2>
                  <div
                    className="text-gray-600 text-sm line-clamp-3 mt-auto"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(article.content),
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

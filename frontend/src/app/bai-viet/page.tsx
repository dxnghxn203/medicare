"use client";
import { useArticle } from "@/hooks/useArticle";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import mainImage from "@/images/22.webp";
import CategoryList from "@/components/Article/categoryList";

type Article = {
  id: string;
  title: string;
  image_thumbnail?: string;
  content?: string;
  category?: string;
  slug: string;
};

const ArticleMain = () => {
  const [mainArticle, setMainArticle] = useState<Article | null>(null);
  const [subArticles, setSubArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { getAllArticlesUser, fetchGetAllArticleUser } = useArticle();

  useEffect(() => {
    fetchGetAllArticleUser(
      () => {
        if (getAllArticlesUser && getAllArticlesUser.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * getAllArticlesUser.length
          );
          const selectedMain = getAllArticlesUser[randomIndex];
          const restArticles = getAllArticlesUser.filter(
            (_: any, i: any) => i !== randomIndex
          );
          setMainArticle(selectedMain);
          setSubArticles(restArticles);
        }
      },
      () => {}
    );
  }, []);

  if (!mainArticle) return null;

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null); // Bỏ chọn nếu click lại
    } else {
      setSelectedCategory(category); // Chọn category mới
    }
  };

  const filteredMainArticle =
    selectedCategory === null
      ? mainArticle
      : [mainArticle, ...subArticles].find(
          (article) => article.category === selectedCategory
        ) || mainArticle; // Fallback to mainArticle if no match found
  if (!filteredMainArticle) return null;

  const filteredArticles = subArticles.filter((article) => {
    return (
      article.category === selectedCategory || selectedCategory === null // Hiển thị tất cả nếu không có category được chọn
    );
  });
  console.log("Filtered Articles:", filteredArticles);
  console.log("subArticles:", subArticles);

  const categories = Array.from(
    new Set(getAllArticlesUser?.map((cat: any) => cat.category))
  ).filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-8 pt-[135px] px-5">
      <div className="text-sm text-[#0053E2] ">
        <Link href="/" className="hover:underline text-blue-600">
          Trang chủ
        </Link>
        <span className="text-gray-500">/ Góc sức khỏe / Truyền thông</span>
      </div>

      <h1 className="text-3xl font-bold py-4">Góc sức khỏe</h1>

      <div className="flex flex-wrap gap-2 p-2 mb-4">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => handleCategoryClick(category as string)}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium border ${
              selectedCategory === category
                ? "bg-blue-500 text-white border-blue-500"
                : "border-gray-300 text-gray-700"
            }`}
          >
            {category as string}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Bài viết chính */}
        <Link
          href={`/bai-viet/${filteredMainArticle.slug}`}
          className="col-span-1 lg:col-span-3 cursor-pointer"
        >
          <div className="col-span-2 overflow-hidden">
            <Image
              src={filteredMainArticle.image_thumbnail || mainImage}
              alt={filteredMainArticle.title}
              width={800}
              height={450}
              className="w-full object-cover rounded-lg"
            />
            <div className="p-4">
              <div className="p-2 my-2 text-xs rounded-full bg-gray-100 text-gray-700 font-medium w-fit">
                {filteredMainArticle.category}
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(filteredMainArticle.title || ""),
                  }}
                />
              </h2>
              <p className="text-gray-600 line-clamp-2">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      filteredMainArticle.content || ""
                    ),
                  }}
                />
              </p>
            </div>
          </div>
        </Link>

        {/* Bài viết phụ */}
        <div className="lg:col-span-2 space-y-4">
          {filteredArticles.slice(0, 5).map((article, index) => (
            <Link
              key={index}
              href={`/bai-viet/${article.slug}`}
              className="flex space-x-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              <div className="flex space-x-4">
                <div className="w-[150px] h-[100px] overflow-hidden rounded-lg flex-shrink-0">
                  <Image
                    src={article.image_thumbnail || mainImage}
                    alt={article.title}
                    width={150}
                    height={100}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <div className="text-xs py-1 px-2 rounded-full bg-gray-100 text-gray-700 font-medium w-fit mb-1">
                    {article.category || "Chưa có danh mục"}
                  </div>
                  <h2 className="text-sm font-semibold">
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(article.title || ""),
                      }}
                    />
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <CategoryList getAllArticles={getAllArticlesUser} />
    </div>
  );
};

export default ArticleMain;

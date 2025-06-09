import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import { useArticle } from "@/hooks/useArticle";
import DOMPurify from "dompurify";

interface ArticleProps {
  imageUrl: any;
  title: string;
  description: string;
  slug: string;
}

const HealthCorner: React.FC = () => {
  const { getAllArticlesUser, fetchGetAllArticleUser } = useArticle();
  useEffect(() => {
    fetchGetAllArticleUser(
      () => {},
      () => {}
    );
  }, []);
  console.log("getAllArticlesUser", getAllArticlesUser);
  return (
    getAllArticlesUser.length > 0 && (
      <div className="flex flex-col w-full max-md:px-5 max-md:max-w-full">
        <Link href="/goc-suc-khoe">
          <div className="flex flex-wrap gap-5 justify-between items-start w-full text-black mt-[-30px]">
            <div className="flex gap-4 text-sm font-semibold ml-auto items-center">
              <div>Xem tất cả</div>
              <FaArrowRightLong />
            </div>
          </div>
        </Link>

        <div className="grid grid-cols-3 gap-8 mt-6 w-full max-md:grid-cols-1 max-md:gap-7">
          {getAllArticlesUser.slice(0, 3).map((article: any) => (
            <Link href={`/bai-viet/${article.slug}`}>
              <div className="flex flex-col cursor-pointer">
                <div className="w-full h-[180px] rounded-2xl overflow-hidden">
                  <Image
                    src={article.image_thumbnail}
                    alt={article.title}
                    width={300}
                    height={180}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="self-start mt-5 text-sm font-semibold line-clamp-1">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(article.title || ""),
                    }}
                  />
                </div>
                <div className="mt-2.5 text-xs text-gray-600 line-clamp-3">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(article.content || ""),
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  );
};

export default HealthCorner;

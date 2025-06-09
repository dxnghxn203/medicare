"use client";
import { useArticle } from "@/hooks/useArticle";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

const DetailArticle = () => {
  const { slug } = useParams();
  const {
    getArticleById,
    fetchGetArticleById,
    fetchGetAllArticleUser,
    getAllArticlesUser,
  } = useArticle();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchGetAllArticleUser(
        () => setLoading(false),
        () => setLoading(false)
      ); // Gọi API lấy tất cả bài viết
    };
    fetchData();
  }, []);
  console.log("getAllArticlesUser", getAllArticlesUser);
  console.log("getArticleById", getArticleById);

  useEffect(() => {
    if (slug && getAllArticlesUser.length > 0) {
      const found = getAllArticlesUser.find((item: any) => item.slug === slug);
      console.log("found", found);
      if (found?.article_id) {
        fetchGetArticleById(
          found.article_id,
          () => setLoading(false),
          () => setLoading(false)
        );
      } else {
        setLoading(false); // không tìm thấy
      }
    }
  }, [slug, getAllArticlesUser]);

  if (loading) {
    return (
      <div className="pt-[94px] p-4 text-center text-gray-500">
        Đang tải bài viết...
      </div>
    );
  }

  if (!getArticleById) {
    return (
      <div className="pt-[94px] p-4 text-red-500">Không tìm thấy bài viết.</div>
    );
  }

  return (
    <div className="pt-[135px] ">
      <div className="text-sm text-[#0053E2] mb-2 px-5">
        <Link href="/" className="hover:underline text-blue-600">
          Trang chủ
        </Link>{" "}
        /{" "}
        <Link href="/bai-viet" className="hover:underline text-blue-600">
          Bài viết
        </Link>{" "}
        /{" "}
        <div className="text-gray-600 inline-block font-normal [&_*]:font-normal">
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(getArticleById.title || ""),
            }}
          />
        </div>
      </div>
      <div className="p-6 max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl font-bold mb-4">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(getArticleById.title || ""),
            }}
          />
        </h1>

        <div className="text-sm text-gray-500 mb-4">
          <strong>{getArticleById.created_by}</strong> -{" "}
          {new Date(getArticleById.updated_date).toLocaleDateString("vi-VN")}
        </div>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(getArticleById.content || ""),
          }}
        />

        <div className="flex space-x-2 mt-4 items-center">
          <h2 className="text-gray-600 text-sm items-center">Chủ đề: </h2>
          <div className="flex flex-wrap gap-2 items-center">
            {getArticleById.tags &&
              getArticleById.tags.length > 0 &&
              JSON.parse(getArticleById.tags[0])?.map(
                (tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full item-center"
                  >
                    {tag}
                  </span>
                )
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailArticle;

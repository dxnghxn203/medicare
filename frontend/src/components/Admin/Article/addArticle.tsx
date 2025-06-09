"use client";
import Link from "next/link";
import DynamicReactQuill from "../Product/CreateProduct/dynamicReactQuill";
import { useState } from "react";
import { useArticle } from "@/hooks/useArticle";
import { useToast } from "@/providers/toastProvider";

type IngredientItem = {
  tag_name: string;
};

const AddArticle = () => {
  const { fetchAddArticleAdmin, fetchAllArticlesAdmin } = useArticle();
  const [articleData, setArticleData] = useState({
    title: "",
    content: "",
    created_by: "",
    category: "",
    tags: [],
    slug: "",
  });
  const toast = useToast();
  const [tags, setTags] = useState<IngredientItem[]>([{ tag_name: "" }]);
  const [image, setImage] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setArticleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateIngredientItem = (
    index: number,
    field: keyof IngredientItem,
    value: string
  ) => {
    const updatedTags = [...tags];
    updatedTags[index] = {
      ...updatedTags[index],
      [field]: value,
    };
    setTags(updatedTags);
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
    console.log("file", file);
  };

  const addIngredientItem = () => {
    setTags((prev) => [...prev, { tag_name: "", tag_amount: "" }]);
  };

  const removeIngredientItem = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", articleData.title);
    formData.append("content", articleData.content);
    formData.append("created_by", articleData.created_by);
    formData.append("tags", JSON.stringify(tags.map((t) => t.tag_name)));
    formData.append("category", articleData.category);
    formData.append("slug", articleData.slug);
    if (image) {
      formData.append("image", image);
    }

    await fetchAddArticleAdmin(
      formData,
      () => {
        toast.showToast("Thêm bài viết thành công", "success");
        fetchAllArticlesAdmin(
          () => {},
          () => {}
        );
        setArticleData({
          title: "",
          content: "",
          created_by: "",
          category: "",
          tags: [],
          slug: "",
        });
        setTags([{ tag_name: "" }]);
        setImage(null);
      },
      () => {
        toast.showToast("Thêm bài viết thất bại", "error");
      }
    );
  };

  return (
    <div>
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-black">Thêm bài viết</h2>
        <div className="my-4 text-sm">
          <Link href="/dashboard" className="hover:underline text-blue-600">
            Dashboard
          </Link>
          <span> / </span>
          <Link href="/quan-ly-bai-viet" className="text-gray-850">
          Quản lý Bài viết
          </Link>
          <span> / </span>
          <Link href="/quan-ly-bai-viet/them-bai-viet" className="text-gray-850">
            Thêm bài viết
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Hình ảnh bài viết */}
          <div className="col-span-2">
            <label className="block mb-1 text-gray-600">
              Hình ảnh bài viết
            </label>
            <div className="border rounded-lg overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border rounded-lg p-2 w-full"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Tiêu đề bài viết */}
          <div className="col-span-2">
            <label className="block mb-1 text-gray-600">Tiêu đề bài viết</label>
            <DynamicReactQuill
              value={articleData.title}
              onChange={(value) =>
                setArticleData((prev) => ({ ...prev, title: value }))
              }
            />
          </div>

          {/* Nội dung bài viết */}
          <div className="col-span-2">
            <label className="block mb-1 text-gray-600">Nội dung</label>
            <div className="border rounded-lg overflow-hidden">
              <DynamicReactQuill
                value={articleData.content}
                onChange={(value) =>
                  setArticleData((prev) => ({ ...prev, content: value }))
                }
              />
            </div>
          </div>
          <div className="col-span-2">
            <label className="block mb-1 text-gray-600">Tác giả</label>
            <div className="border rounded-lg overflow-hidden">
              <input
                type="text"
                name="created_by"
                value={articleData.created_by}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Nhập tên tác giả"
              />
            </div>
          </div>
          <div className="col-span-2">
            <label className="block mb-1 text-gray-600">Danh mục</label>
            <div className="border rounded-lg overflow-hidden">
              <input
                type="text"
                name="category"
                value={articleData.category}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Nhập tên tác giả"
              />
            </div>
          </div>
          <div className="col-span-2">
            <label className="block mb-1 text-gray-600">Slug</label>
            <div className="border rounded-lg overflow-hidden">
              <input
                type="text"
                name="slug"
                value={articleData.slug}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Nhập tên tác giả"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="col-span-2">
            <label className="block mb-1 text-gray-600">Tags</label>
            {tags.map((tag, index) => (
              <div key={index} className="mb-3 p-3 border rounded-lg">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">Tag {index + 1}</h4>
                  {tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredientItem(index)}
                      className="text-red-500 text-sm"
                    >
                      Xóa
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tên tag
                    </label>
                    <input
                      type="text"
                      value={tag.tag_name}
                      onChange={(e) =>
                        updateIngredientItem(index, "tag_name", e.target.value)
                      }
                      className="border rounded-lg p-2 w-full"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addIngredientItem}
              className="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
            >
              + Thêm tag mới
            </button>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800"
            >
              Lưu bài viết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddArticle;

"use client";
import Link from "next/link";
import {useCallback, useEffect, useRef, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import DynamicReactQuill from "../Product/CreateProduct/dynamicReactQuill";
import {useArticle} from "@/hooks/useArticle";
import {useToast} from "@/providers/toastProvider";
import {MdOutlineEdit} from "react-icons/md";

type TagItem = {
    tag_name: string;
};

const EditArticle = () => {
    const [articleData, setArticleData] = useState({
        title: "",
        content: "",
        created_by: "",
        category: "",
        updated_date: "",
        slug: "",
    });
    const [tags, setTags] = useState<TagItem[]>([{tag_name: ""}]);
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isImageChanged, setIsImageChanged] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        fetchUpdateArticleAdmin,
        fetchAllArticlesAdmin,
        getAllArticlesAdmin,
        fetchUpdateLogoArticleAdmin,
    } = useArticle();
    const toast = useToast();
    const searchParams = useSearchParams();
    const updateId = searchParams.get("id");
    const router = useRouter();

    useEffect(() => {
        if (!updateId) return;
        fetchAllArticlesAdmin(
            () => {
                const article = getAllArticlesAdmin.find(
                    (item: any) => item.article_id.toString() === updateId
                );
                console.log("article", article);
                if (article) {
                    const updatedDate = article.updated_date
                        ? article.updated_date.split("T")[0]
                        : "";
                    setArticleData({
                        title: article.title,
                        content: article.content,
                        created_by: article.created_by,
                        category: article.category,
                        updated_date: updatedDate,
                        slug: article.slug,
                    });
                    setTags(
                        Array.isArray(article.tags)
                            ? article.tags.map((tag: any) => ({
                                tag_name: tag.tag_name || tag,
                            }))
                            : []
                    );
                    setPreviewImage(article.image_thumbnail || null);
                }
            },
            () => toast.showToast("Không thể tải danh sách bài viết", "error")
        );
    }, [updateId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setArticleData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setImage(file);
            setIsImageChanged(true);
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
        }
    };

    const handleTagChange = (index: number, value: string) => {
        const newTags = [...tags];
        newTags[index].tag_name = value;
        setTags(newTags);
    };

    const handleContentChange = useCallback((value: string) => {
        setArticleData((prev) => ({...prev, content: value}));
    }, []);

    const handleTitleChange = useCallback((value: string) => {
        setArticleData((prev) => ({...prev, title: value}));
    }, []);

    const addTag = () => setTags([...tags, {tag_name: ""}]);

    const removeTag = (index: number) =>
        setTags(tags.filter((_, i) => i !== index));

    const handleSubmit = async () => {
        const body = {
            article_id: updateId,
            title: articleData.title,
            content: articleData.content,
            created_by: articleData.created_by,
            category: articleData.category,
            tags: tags.map((tag) => tag.tag_name),
            slug: articleData.slug,
        };

        if (isImageChanged && image) {
            const formData = new FormData();
            formData.append("article_id", updateId || "");
            formData.append("image", image);

            fetchUpdateLogoArticleAdmin(
                formData,
                updateId,
                () => toast.showToast("Cập nhật ảnh thành công", "success"),
                () => toast.showToast("Cập nhật ảnh thất bại", "error")
            );
        }

        fetchUpdateArticleAdmin(
            body,
            () => {
                toast.showToast("Cập nhật bài viết thành công", "success");
                router.push("/quan-ly-bai-viet");
            },
            () => toast.showToast("Cập nhật bài viết thất bại", "error")
        );
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-black">Cập nhật bài viết</h2>

            <div className="my-4 text-sm">
                <Link href="/dashboard" className="hover:underline text-blue-600">
                    Dashboard
                </Link>
                <span> / </span>
                <Link href="/quan-ly-bai-viet" className="text-gray-850">
                    Quản lý Bài viết
                </Link>
                <span> / </span>
                <span className="text-gray-850">Cập nhật bài viết</span>
            </div>

            {/* Hình ảnh */}
            <div className="w-40">
                <label className="block mb-1 text-gray-600">Hình ảnh</label>
                {previewImage && (
                    <div className="relative mb-4">
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-auto rounded-lg"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-1 right-1 bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-gray-100"
                            title="Chỉnh sửa ảnh"
                        >
                            <MdOutlineEdit className="w-4 h-4 text-gray-600"/>
                        </button>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                />
            </div>

            {/* Tiêu đề */}
            <div>
                <label className="block mb-1 text-gray-600">Tiêu đề bài viết</label>
                <DynamicReactQuill
                    value={articleData.title}
                    onChange={handleTitleChange}
                />
            </div>

            {/* Nội dung */}
            <div>
                <label className="block mb-1 text-gray-600">Nội dung</label>
                <DynamicReactQuill
                    value={articleData.content}
                    onChange={handleContentChange}
                />
            </div>

            {/* Tác giả */}
            <div>
                <label className="block mb-1 text-gray-600">Tác giả</label>
                <input
                    type="text"
                    name="created_by"
                    value={articleData.created_by}
                    onChange={handleInputChange}
                    className="border rounded-lg p-2 w-full"
                    placeholder="Nhập tên tác giả"
                />
            </div>

            {/* Danh mục */}
            <div>
                <label className="block mb-1 text-gray-600">Danh mục</label>
                <input
                    type="text"
                    name="category"
                    value={articleData.category}
                    onChange={handleInputChange}
                    className="border rounded-lg p-2 w-full"
                    placeholder="Nhập danh mục"
                />
            </div>

            {/* Slug */}
            <div>
                <label className="block mb-1 text-gray-600">Slug</label>
                <input
                    type="text"
                    name="slug"
                    value={articleData.slug}
                    onChange={handleInputChange}
                    className="border rounded-lg p-2 w-full"
                    placeholder="Nhập slug"
                />
            </div>

            {/* Tags */}
            <div>
                <label className="block mb-1 text-gray-600">Tags</label>
                {tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                            type="text"
                            value={tag.tag_name}
                            onChange={(e) => handleTagChange(index, e.target.value)}
                            className="border rounded-lg p-2 w-full"
                        />
                        {tags.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeTag(index)}
                                className="text-red-500"
                            >
                                X
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addTag}
                    className="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
                >
                    + Thêm tag mới
                </button>
            </div>

            {/* Ngày cập nhật */}
            <div>
                <label className="block mb-1 text-gray-600">Ngày cập nhật</label>
                <input
                    type="text"
                    name="updated_date"
                    value={articleData.updated_date}
                    onChange={handleInputChange}
                    className="border rounded-lg p-2 w-full"
                    placeholder="Nhập ngày cập nhật"
                />
            </div>

            {/* Nút lưu */}
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
    );
};

export default EditArticle;

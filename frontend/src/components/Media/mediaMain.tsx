import mainImage from "@/images/22.webp";
import Image from "next/image";
import Link from "next/link";
import { SlUmbrella } from "react-icons/sl";
const MediaMain = () => {
  const articles = [
    {
      title:
        "FPT Long Châu lên tiếng về thông tin sai lệch liên quan sản phẩm Happy Mom",
      excerpt:
        "FPT Long Châu chính thức phản hồi về thông tin sai lệch liên quan đến sản phẩm Happy Mom...",
      image: "/images/happy-mom.jpg",
      date: "15/04/2025",
      slug: "cach-tra-cuu-thong-tin-dang-ky-thuoc",
    },
    {
      title:
        "Giải pháp điều trị mỡ máu tiên tiến hàng đầu thế giới đã có mặt tại Việt Nam",
      excerpt:
        "FPT Long Châu giới thiệu giải pháp điều trị mỡ máu thế hệ mới...",
      image: "/images/mo-mau.jpg",
      date: "10/04/2025",
    },
    {
      title: "Tọa đàm chuyên môn với chuyên gia dinh dưỡng hàng đầu",
      excerpt:
        "Sự kiện tọa đàm giúp nâng cao hiểu biết về dinh dưỡng cho cộng đồng...",
      image: "/images/toa-dam.jpg",
      date: "05/04/2025",
    },
    {
      title: "Tọa đàm chuyên môn với chuyên gia dinh dưỡng hàng đầu",
      excerpt:
        "Sự kiện tọa đàm giúp nâng cao hiểu biết về dinh dưỡng cho cộng đồng...",
      image: "/images/toa-dam.jpg",
      date: "05/04/2025",
    },
    {
      title: "Tọa đàm chuyên môn với chuyên gia dinh dưỡng hàng đầu",
      excerpt:
        "Sự kiện tọa đàm giúp nâng cao hiểu biết về dinh dưỡng cho cộng đồng...",
      image: "/images/toa-dam.jpg",
      date: "05/04/2025",
    },
    {
      title: "Tọa đàm chuyên môn với chuyên gia dinh dưỡng hàng đầu",
      excerpt:
        "Sự kiện tọa đàm giúp nâng cao hiểu biết về dinh dưỡng cho cộng đồng...",
      image: "/images/toa-dam.jpg",
      date: "05/04/2025",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tin tức truyền thông</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bài viết chính */}
        <Link
          href={`/goc-suc-khoe/truyen-thong/${articles[0].slug}`}
          className="col-span-1 lg:col-span-1"
        >
          <div className="col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
            <Image
              src={mainImage}
              alt={articles[0].title}
              className="w-full object-cover"
            />
            <div className="p-4">
              <div className="p-2 my-2 text-xs rounded-full bg-gray-100 text-gray-700 font-medium w-fit">
                Truyền thông
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                {articles[0].title}
              </h2>
              <p className="text-gray-600">{articles[0].excerpt}</p>
            </div>
          </div>
        </Link>

        {/* Các bài viết phụ */}
        <div className="space-y-6">
          {articles.slice(1).map((article, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-12 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-1">{article.date}</p>
                <h2 className="text-sm font-semibold mb-2">{article.title}</h2>
                <p className="text-sm text-gray-600">{article.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaMain;

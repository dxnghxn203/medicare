import { GoAlertFill } from "react-icons/go";
import { useState } from "react";
import DOMPurify from "dompurify";
import { CheckCircle } from "lucide-react";
import pharmacist_male from "@/images/pharmacist_male.png";
import pharmacist_female from "@/images/pharmacist_male.png";
import { FaArrowRightLong, FaCircleCheck } from "react-icons/fa6";
import Image from "next/image";

const SafeHtmlDisplay = ({ htmlContent }: { htmlContent: string }) => {
  const cleanHtml = DOMPurify.sanitize(htmlContent); // Lọc HTML an toàn

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: cleanHtml }} // Render nội dung HTML an toàn
    />
  );
};
const DescribeProduct = ({ product }: { product: any }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#F5F7F9] rounded-lg p-5 space-y-4">
      {/* Mô tả sản phẩm */}
      {product?.full_descriptionsn === null && (
        <div className="space-y-2">
          <div className="text-xl font-bold">Mô tả sản phẩm</div>
          <SafeHtmlDisplay htmlContent={product?.full_descriptions || ""} />
        </div>
      )}

      {/* Thành phần */}
      <div className="space-y-2">
        <div className="text-xl font-bold">Thành phần</div>
        <div className="overflow-hidden rounded-lg border border-gray-300 w-[80%]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-300">
                <th className="text-left p-3 font-semibold">
                  Thông tin thành phần
                </th>
                <th className="text-left p-3 font-semibold">Hàm lượng</th>
              </tr>
            </thead>
            <tbody>
              {product?.ingredients.map((item: any, index: any) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-t`}
                >
                  <td className="p-3">{item.ingredient_name}</td>
                  <td className="p-3">{item.ingredient_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Công dụng */}
      <div className="space-y-2">
        <div className="text-xl font-bold">Công dụng</div>
        <SafeHtmlDisplay htmlContent={product?.uses || ""} />
      </div>

      {/* Cách dùng */}
      <div className="space-y-2">
        <div className="text-xl font-bold">Cách dùng</div>
        <SafeHtmlDisplay htmlContent={product?.dosage || ""} />
      </div>

      {/* Nội dung ẩn */}
      {expanded && (
        <>
          {/* Tác dụng phụ */}
          <div className="space-y-2">
            <div className="text-xl font-bold">Tác dụng phụ</div>
            <SafeHtmlDisplay htmlContent={product?.side_effects || ""} />
            <div className="bg-[#FFF3E1] rounded-lg px-4 py-4 space-y-2">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 text-[#FFC048] font-semibold text-xl">
                  <GoAlertFill />
                  <span>Lưu ý</span>
                </div>

                <SafeHtmlDisplay htmlContent={product?.precautions || ""} />
              </div>
            </div>
          </div>

          {/* Bảo quản */}
          <div className="space-y-2">
            <div className="text-xl font-bold">Bảo quản</div>
            <SafeHtmlDisplay htmlContent={product?.storage || ""} />
          </div>
        </>
      )}

      {/* Nút mở rộng */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mx-auto flex justify-center text-[#002E99] font-semibold mt-4"
      >
        {expanded ? "Thu gọn" : "Xem thêm"}
      </button>
      <div className="flex items-start p-4 bg-[#EAEFFA] rounded-lg">
        {product.pharmacist_gender === "Nam" ? (
          <Image
            src={pharmacist_male}
            alt="Pharmacist"
            className="w-16 h-16 rounded-full object-cover mr-4 "
          />
        ) : (
          <Image
            src={pharmacist_female}
            alt="Pharmacist"
            className="w-16 h-16 rounded-full object-cover mr-4"
          />
        )}

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">
              Dược sĩ <span>{product.pharmacist_name}</span>
            </h3>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <FaCircleCheck className="w-4 h-4 mr-2" />
              Đã kiểm duyệt nội dung
            </div>
          </div>

          <p className="text-gray-700 mt-1">
            Tốt nghiệp chuyên ngành Dược, với nền tảng kiến thức vững chắc và
            nhiều năm kinh nghiệm công tác trong lĩnh vực Dược học. Hiện đang là
            giảng viên đào tạo Dược sĩ tại Nhà thuốc Medicare.
          </p>

          <a
            href="#"
            className="text-sm text-blue-600 hover:underline mt-2 inline-block flex items-center space-x-2"
          >
            Xem thêm thông tin <FaArrowRightLong className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default DescribeProduct;

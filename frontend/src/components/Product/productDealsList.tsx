import React, { useEffect, useState } from "react";
import ProductDealsCard from "./productDealsCard";
import Link from "next/link";
import { useProduct } from "@/hooks/useProduct";
import { FaArrowRightLong } from "react-icons/fa6";

const ProductDealsList: React.FC = () => {
  const { fetchProductBestDeal, productBestDeal } = useProduct();
  const [topN, setTopN] = useState(5);
  useEffect(() => {
    fetchProductBestDeal();
  }, []);

  console.log("productBestDeal", productBestDeal);

  return (
    productBestDeal.length > 0 && (
      <div className="w-full">
        <Link href="/bo-suu-tap/deals-tot-nhat-danh-cho-ban">
          <div className="flex flex-wrap gap-5 justify-between items-start w-full text-black mt-[-30px]">
            <div className="flex gap-4 text-sm font-semibold ml-auto items-center">
              <div>Tất cả sản phẩm</div>
              <FaArrowRightLong />
            </div>
          </div>
        </Link>

        <div className="self-center mt-5 w-full max-md:max-w-full">
          <div className="grid grid-cols-5 gap-6 max-md:grid-cols-2">
            {productBestDeal &&
              productBestDeal.map((product: any, index: any) => (
                <ProductDealsCard key={index} product={product} />
              ))}
          </div>
        </div>
      </div>
    )
  );
};

export default ProductDealsList;

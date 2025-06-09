import React, { useEffect } from "react";
import ProductsViewCard from "./productsViewedCard";
import { useProduct } from "@/hooks/useProduct";
import { FaArrowRightLong } from "react-icons/fa6";

const ProductsViewedList: React.FC = () => {
  const { productGetRecentlyViewed, fetchProductRecentlViewed } = useProduct();

  useEffect(() => {
    fetchProductRecentlViewed();
  }, []);

  return (
    <div className="w-full">
      <div className="self-start text-2xl font-extrabold text-black mb-5">
        Sản phẩm vừa xem
      </div>
      <div className="flex flex-wrap gap-5 justify-between items-start w-full text-black mt-[-30px]">
        {productGetRecentlyViewed?.length < 0 && (
          <div className="flex gap-4 text-sm font-semibold ml-auto items-center">
            <div>Tất cả sản phẩm</div>
            <FaArrowRightLong />
          </div>
        )}
      </div>
      <div className="self-center mt-5 w-full max-md:max-w-full">
        <div className="grid grid-cols-5 gap-6 max-md:grid-cols-2">
          {productGetRecentlyViewed &&
            productGetRecentlyViewed.map((product: any, index: any) => (
              <ProductsViewCard key={index} product={product} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsViewedList;
